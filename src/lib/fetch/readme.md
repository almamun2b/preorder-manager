# `$fetch` — Axios-style Fetch Wrapper for Next.js

A production-ready, type-safe fetch utility for Next.js (App Router) and any TypeScript project. Extends the native `RequestInit` interface so every current and future browser fetch option works out of the box — with zero extra code.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Creating a Shared Instance](#creating-a-shared-instance)
- [HTTP Methods](#http-methods)
  - [GET](#get)
  - [POST](#post)
  - [PUT](#put)
  - [PATCH](#patch)
  - [DELETE](#delete)
  - [HEAD](#head)
  - [OPTIONS](#options)
  - [request (escape hatch)](#request-escape-hatch)
- [Request Options](#request-options)
  - [Query Parameters](#query-parameters)
  - [Request Body](#request-body)
  - [Custom Headers](#custom-headers)
  - [Timeout](#timeout)
  - [Base URL Override](#base-url-override)
  - [Native RequestInit Options](#native-requestinit-options)
- [Next.js Caching](#nextjs-caching)
  - [ISR — Time-based Revalidation](#isr--time-based-revalidation)
  - [Tag-based On-demand Revalidation](#tag-based-on-demand-revalidation)
  - [Opt out of Caching](#opt-out-of-caching)
  - [Explicit Cache Mode](#explicit-cache-mode)
- [Lifecycle Hooks](#lifecycle-hooks)
  - [onRequest](#onrequest)
  - [onResponse](#onresponse)
  - [onSuccess](#onsuccess)
  - [onError](#onerror)
- [Response Shape](#response-shape)
- [Error Handling](#error-handling)
  - [FetchError](#fetcherror)
  - [Error Guards](#error-guards)
- [Cancellation](#cancellation)
- [TypeScript API](#typescript-api)
  - [Exported Types](#exported-types)
- [Real-World Recipes](#real-world-recipes)
  - [Auth API client](#auth-api-client)
  - [File Upload](#file-upload)
  - [Server Component with ISR](#server-component-with-isr)
  - [Server Action with Tag Revalidation](#server-action-with-tag-revalidation)
  - [Token Refresh on 401](#token-refresh-on-401)

---

## Features

- **Axios-style API** — `.get()`, `.post()`, `.put()`, `.patch()`, `.delete()`, `.head()`, `.options()`, `.request()`
- **Extends `RequestInit`** — all native fetch options (`credentials`, `mode`, `redirect`, `keepalive`, `integrity`, etc.) work automatically
- **Strict TypeScript** — fully generic request/response types, zero `any`
- **Next.js App Router** — first-class `revalidate`, `tags`, and `cache` support
- **4 focused lifecycle hooks** — `onRequest`, `onResponse`, `onSuccess`, `onError`
- **Smart body serialisation** — plain objects → JSON, `FormData` → multipart, passthrough for `Blob`/`ArrayBuffer`/`string`
- **Automatic Content-Type** — set only when needed, never overriding what you pass
- **Timeout + AbortSignal** — built-in timeout with optional external signal merging
- **Typed `FetchError`** — `.isHttpError`, `.isNetworkError`, `.isTimeout` guards
- **Content-type-aware parsing** — JSON, text, or Blob based on the `Content-Type` header

---

## Installation

Copy `$fetch.ts` into your project (e.g. `src/lib/$fetch.ts`). No dependencies required — only the native `fetch` API.

```
src/
└── lib/
    └── $fetch.ts
```

---

## Quick Start

The default `$fetch` export is a zero-config instance. Import and call directly for one-off requests.

```ts
import { $fetch } from '@/lib/$fetch'

const { data } = await $fetch.get<User>('https://api.example.com/me')
console.log(data.name)
```

---

## Creating a Shared Instance

For real applications, create a named instance with `createFetch()` and share it across the project. This is the recommended pattern.

```ts
// src/lib/api.ts
import { createFetch } from '@/lib/$fetch'

export const api = createFetch({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  headers: {
    Accept: 'application/json',
    'X-App-Version': '1.0.0',
  },
  timeout: 10_000,
  next: { revalidate: 60 },
})
```

```ts
// anywhere in your app
import { api } from '@/lib/api'

const { data } = await api.get<User[]>('/users')
```

### `createFetch` options

| Option         | Type                     | Description                                                           |
| -------------- | ------------------------ | --------------------------------------------------------------------- |
| `baseURL`      | `string`                 | Prepended to every relative path. Trailing slashes are normalised.    |
| `headers`      | `Record<string, string>` | Default headers merged into every request (per-request headers win).  |
| `timeout`      | `number`                 | Default timeout in milliseconds. Overridable per-request.             |
| `interceptors` | `Interceptors`           | Lifecycle hooks — see [Lifecycle Hooks](#lifecycle-hooks).            |
| `next`         | `NextOptions`            | Default Next.js caching options. Per-request `next` is merged on top. |

---

## HTTP Methods

### GET

Use for reading data. Safe and idempotent — no body is sent.

```ts
// Basic
const { data } = await api.get<User>('/users/1')

// With query params
const { data: users } = await api.get<User[]>('/users', {
  params: { page: 1, limit: 20, role: 'admin' },
})

// With Next.js caching
const { data: posts } = await api.get<Post[]>('/posts', {
  next: { revalidate: 300, tags: ['posts'] },
})
```

### POST

Use for creating resources or submitting data.

```ts
interface CreateUserDto {
  name: string
  email: string
  role: 'admin' | 'user'
}

interface UserResponse {
  id: string
  name: string
  email: string
}

const { data: newUser } = await api.post<UserResponse, CreateUserDto>(
  '/users',
  {
    name: 'Mamun',
    email: 'mamun@example.com',
    role: 'admin',
  }
)
```

### PUT

Use for full resource replacement — the body replaces the entire resource.

```ts
const { data: updated } = await api.put<UserResponse, CreateUserDto>(
  '/users/123',
  {
    name: 'Mamun Updated',
    email: 'mamun@example.com',
    role: 'user',
  }
)
```

### PATCH

Use for partial updates — only send the fields you want to change.

```ts
const { data } = await api.patch<UserResponse, Partial<CreateUserDto>>(
  '/users/123',
  {
    role: 'admin',
  }
)
```

**When to use PUT vs PATCH:**

- `PUT` — you are sending the complete replacement object
- `PATCH` — you are sending only the changed fields

### DELETE

Use for removing resources.

```ts
// No response body (204)
await api.delete('/users/123')

// With typed response body
const { data } = await api.delete<{ success: boolean }>('/users/123')
```

### HEAD

Identical to GET but the server returns only headers — no body. Use to check if a resource exists or probe cache/ETag headers without transferring data.

```ts
const { status, headers } = await api.head('/users/123')

const exists = status === 200
const etag = headers.get('etag')
```

### OPTIONS

Use for CORS preflight or to discover which methods an endpoint accepts.

```ts
const { headers } = await api.options('/users')
const allowed = headers.get('allow') // e.g. "GET, POST, PUT"
```

### `request` (escape hatch)

Use when you need a method not covered by the named shortcuts, or when the method is determined at runtime.

```ts
const { data } = await api.request<ReportData>('REPORT', '/calendar', {
  body: { start: '2024-01-01', end: '2024-12-31' },
})
```

---

## Request Options

Every method accepts a `FetchOptions` object. It extends `Omit<RequestInit, 'body' | 'method'>`, so all native fetch options are available.

### Query Parameters

Pass `params` and the utility serialises them into the URL automatically. Arrays become repeated keys.

```ts
await api.get('/users', {
  params: {
    page: 1,
    limit: 20,
    status: 'active',
    role: ['admin', 'editor'], // → &role=admin&role=editor
    search: undefined, // → omitted automatically
  },
})
// → GET /users?page=1&limit=20&status=active&role=admin&role=editor
```

`null` and `undefined` values are silently skipped, so you can safely spread optional filters.

### Request Body

The body is serialised automatically based on its type:

| Body type            | What `$fetch` does     | `Content-Type` set                  |
| -------------------- | ---------------------- | ----------------------------------- |
| Plain object / array | `JSON.stringify(body)` | `application/json` (auto)           |
| `FormData`           | Sent as-is             | Set by runtime (includes boundary)  |
| `URLSearchParams`    | Sent as-is             | `application/x-www-form-urlencoded` |
| `Blob`               | Sent as-is             | Not set (you set it)                |
| `ArrayBuffer` / view | Sent as-is             | Not set (you set it)                |
| `string`             | Sent as-is             | Not set (you set it)                |

> `Content-Type` is only auto-set for plain objects and only if you haven't already provided it.

### Custom Headers

Per-request headers are merged on top of instance defaults. Header names are compared case-insensitively.

```ts
await api.get('/admin/report', {
  headers: {
    'X-Admin-Token': process.env.ADMIN_SECRET!,
    'Accept-Language': 'en-US',
  },
})
```

### Timeout

Aborts the request and throws a `FetchError` with `isTimeout === true` when exceeded.

```ts
// Instance-level default (10 seconds)
const api = createFetch({ timeout: 10_000 })

// Override per-request
const { data } = await api.get('/health', { timeout: 2_000 })

// Disable timeout for a specific request
const { data } = await api.get('/large-export', { timeout: 0 })
```

### Base URL Override

Override the instance `baseURL` for a single request — useful for hitting a different service from a shared instance.

```ts
const { data } = await api.get('/v2/rates', {
  baseURL: 'https://currency.example.com',
})
```

### Native `RequestInit` Options

Because `FetchOptions` extends `RequestInit`, every native fetch option works directly:

```ts
await api.get('/secure-endpoint', {
  credentials: 'include', // send cookies cross-origin
  mode: 'cors',
  redirect: 'follow',
  referrerPolicy: 'strict-origin-when-cross-origin',
  keepalive: true, // keep request alive after page unload
  integrity: 'sha256-abc123=', // subresource integrity check
  cache: 'no-store', // native cache control
})
```

---

## Next.js Caching

`$fetch` has first-class support for Next.js App Router caching via the `next` option. This maps directly to the `next` property that Next.js injects into `fetch()`.

### ISR — Time-based Revalidation

Cache the response and revalidate it in the background after `n` seconds.

```ts
// Cache for 5 minutes
const { data } = await api.get<Product[]>('/products', {
  next: { revalidate: 300 },
})
```

Set a project-wide default on the instance and override per-request:

```ts
const api = createFetch({
  next: { revalidate: 60 }, // 1 minute default for all requests
})

// This request overrides to 10 minutes
const { data } = await api.get('/static-config', {
  next: { revalidate: 600 },
})
```

### Tag-based On-demand Revalidation

Tag the cached response so it can be invalidated programmatically with `revalidateTag()`.

```ts
// In a Server Component or data-fetching function
const { data: post } = await api.get<Post>(`/posts/${slug}`, {
  next: { tags: [`post-${slug}`, 'posts'] },
})
```

```ts
// In a Server Action — invalidate all tagged caches
'use server'
import { revalidateTag } from 'next/cache'

export async function publishPost(slug: string) {
  await api.patch(`/posts/${slug}`, { published: true })
  revalidateTag(`post-${slug}`)
  revalidateTag('posts')
}
```

### Opt out of Caching

Use `revalidate: false` to tell Next.js never to cache this response — equivalent to `cache: 'no-store'`. Ideal for real-time data.

```ts
const { data: livePrice } = await api.get('/prices/btc', {
  next: { revalidate: false },
})
```

### Explicit Cache Mode

Use `cache` directly when you need the full native `RequestCache` vocabulary.

```ts
// Always fetch fresh — bypass both cache and CDN
await api.get('/session', { cache: 'no-store' })

// Force cache — serve stale until manually revalidated
await api.get('/config', { cache: 'force-cache' })
```

**Priority order when both `cache` and `next.revalidate` are set:**

`cache` (explicit) **>** `next.revalidate: false` → `no-store` **>** `next.revalidate: number` → `force-cache`

---

## Lifecycle Hooks

Hooks are configured per-instance via `interceptors`. Every hook is optional and async-capable.

### Execution order

```
onRequest → fetch() → onResponse → onSuccess
                           │ (non-2xx)
                        onError → throw
                ↓ (network / timeout)
             onError → throw
```

### `onRequest`

Runs immediately before `fetch()`, after all options are merged and the URL is built. This is the **only stage** where the outgoing request can still be mutated.

**Use for:** attaching auth tokens, injecting trace IDs, logging outgoing requests.

```ts
const api = createFetch({
  interceptors: {
    onRequest: (req) => {
      // Attach Bearer token
      const token = getToken()
      if (token) {
        ;(req.init.headers as Record<string, string>)['Authorization'] =
          `Bearer ${token}`
      }

      // Inject trace ID for distributed tracing
      ;(req.init.headers as Record<string, string>)['X-Request-Id'] =
        crypto.randomUUID()

      // Log the outgoing request
      console.log(`→ ${req.method} ${req.url}`)

      return req // must return the request
    },
  },
})
```

### `onResponse`

Runs after `fetch()` resolves and the body is parsed, **before the 2xx check**. Receives every response regardless of status — including 4xx and 5xx.

**Use for:** logging all responses, metrics, reading headers that are only present on error responses.

```ts
const api = createFetch({
  interceptors: {
    onResponse: (res) => {
      // Log every response
      console.log(`← ${res.status} ${res.statusText}`)

      // Record response time metrics
      metrics.histogram('http.status', res.status)

      // To suppress an error for a specific status, return ok: true
      if (res.status === 404) {
        return { ...res, ok: true, data: null }
      }

      return res // must return the response
    },
  },
})
```

### `onSuccess`

Runs only for **successful (2xx) responses**, after `onResponse`. The right place to transform or unwrap data before it reaches the caller.

**Use for:** unwrapping API envelope shapes (`{ data: T, meta: ... }` → `T`), normalising response structure, camelCase conversion.

```ts
interface ApiEnvelope<T> {
  payload: T
  meta: { requestId: string }
}

const api = createFetch({
  interceptors: {
    onSuccess: (res) => {
      // Unwrap `{ payload: T }` envelope on every success
      const enveloped = res.data as ApiEnvelope<unknown>
      return { ...res, data: enveloped.payload }
    },
  },
})

// Caller receives the unwrapped T directly
const { data } = await api.get<User>('/users/1')
// data is User, not ApiEnvelope<User>
```

### `onError`

Runs just before a `FetchError` is thrown — covers non-2xx HTTP errors, network failures, and timeouts in one unified place. **Must re-throw** the error or throw a new one.

**Use for:** centralised error logging, Sentry reporting, token refresh + retry, 401 redirects.

```ts
const api = createFetch({
  interceptors: {
    onError: (err) => {
      // Log to Sentry
      Sentry.captureException(err, {
        extra: { status: err.status, response: err.response?.data },
      })

      // Redirect to login on 401
      if (err.status === 401) {
        router.push('/login')
        throw err
      }

      // Show user-friendly toast on 5xx
      if (err.status >= 500) {
        toast.error('Something went wrong. Please try again.')
      }

      throw err // must always re-throw
    },
  },
})
```

---

## Response Shape

Every `$fetch` method returns a `Promise<FetchResponse<TData>>`:

```ts
interface FetchResponse<TData> {
  data: TData // parsed response body
  status: number // HTTP status code (e.g. 200, 404)
  statusText: string // HTTP status text (e.g. "OK", "Not Found")
  headers: Headers // raw response Headers object
  ok: boolean // true when status is 200–299
}
```

**Body parsing** is automatic based on `Content-Type`:

| `Content-Type`     | Parsed as    |
| ------------------ | ------------ |
| `application/json` | `res.json()` |
| `text/*`           | `res.text()` |
| anything else      | `res.blob()` |
| 204 / empty body   | `undefined`  |

```ts
const { data, status, headers, ok } = await api.get<User>('/users/1')

// Read a response header
const rateLimit = headers.get('x-ratelimit-remaining')
```

---

## Error Handling

Non-2xx responses, network failures, and timeouts all throw a `FetchError`. Wrap calls in `try/catch` or handle them centrally in `onError`.

### `FetchError`

```ts
class FetchError extends Error {
  status: number // HTTP code, 0 = network error, -1 = timeout
  statusText: string // "Not Found" | "Network Error" | "Timeout"
  response?: FetchResponse<unknown> // parsed response (when server responded)

  get isHttpError(): boolean // status > 0 (server responded with non-2xx)
  get isNetworkError(): boolean // status === 0 (no server response)
  get isTimeout(): boolean // status === -1 (timeout exceeded)
}
```

### Error Guards

```ts
import { FetchError } from '@/lib/$fetch'

try {
  const { data } = await api.get<User>('/users/1')
} catch (err) {
  if (err instanceof FetchError) {
    if (err.isTimeout) {
      console.error('Request timed out')
    } else if (err.isNetworkError) {
      console.error('No internet connection')
    } else if (err.isHttpError) {
      console.error(`HTTP ${err.status}: ${err.statusText}`)

      // Access the parsed error body from the server
      const errorBody = err.response?.data as { message: string }
      console.error(errorBody.message)

      if (err.status === 404) {
        /* not found */
      }
      if (err.status === 422) {
        /* validation error */
      }
      if (err.status === 403) {
        /* forbidden */
      }
    }
  }
}
```

---

## Cancellation

Pass an `AbortSignal` to cancel a request. If a `timeout` is also set, either source can abort the request — whichever fires first.

```ts
const controller = new AbortController()

// Cancel after 3 seconds
setTimeout(() => controller.abort(), 3_000)

try {
  const { data } = await api.get('/slow-endpoint', {
    signal: controller.signal,
  })
} catch (err) {
  if (err instanceof FetchError && err.isNetworkError) {
    console.log('Request was cancelled')
  }
}
```

**In React — cancel on unmount:**

```ts
useEffect(() => {
  const controller = new AbortController()

  api
    .get<User[]>('/users', { signal: controller.signal })
    .then(({ data }) => setUsers(data))
    .catch((err) => {
      if (!(err instanceof FetchError && err.isNetworkError)) throw err
    })

  return () => controller.abort()
}, [])
```

---

## TypeScript API

### Exported Types

| Export                 | Kind        | Description                                 |
| ---------------------- | ----------- | ------------------------------------------- |
| `$fetch`               | `const`     | Default zero-config instance                |
| `createFetch`          | `function`  | Factory to create a configured instance     |
| `FetchError`           | `class`     | Error thrown on failures                    |
| `HttpMethod`           | `type`      | `'GET' \| 'POST' \| 'PUT' \| ...`           |
| `QueryParams`          | `type`      | `Record<string, Primitive \| Primitive[]>`  |
| `QueryParamValue`      | `type`      | `Primitive \| Primitive[]`                  |
| `FetchOptions<TBody>`  | `interface` | Per-request options (extends `RequestInit`) |
| `FetchResponse<TData>` | `interface` | Normalised response shape                   |
| `ResolvedRequest`      | `interface` | Shape received by `onRequest` hook          |
| `Interceptors`         | `interface` | All four lifecycle hooks                    |
| `CreateFetchOptions`   | `interface` | Options for `createFetch()`                 |
| `NextOptions`          | `interface` | `{ revalidate?, tags? }`                    |

### Generic type parameters

Most methods accept two type parameters:

```ts
api.post<TData, TBody>(url, body, options)
//       ↑             ↑
//       response      request body
```

You can pass just the response type and leave `TBody` inferred:

```ts
const { data } = await api.post<User>('/users', { name: 'Mamun' })
//                                     ↑ inferred as { name: string }
```

---

## Real-World Recipes

### Auth API client

```ts
// src/lib/api.ts
import { createFetch, FetchError } from '@/lib/$fetch'
import { getSession, clearSession } from '@/lib/session'

export const api = createFetch({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
    'X-Client': 'web',
  },
  interceptors: {
    onRequest: async (req) => {
      const session = await getSession()
      if (session?.accessToken) {
        ;(req.init.headers as Record<string, string>)['Authorization'] =
          `Bearer ${session.accessToken}`
      }
      return req
    },
    onError: async (err) => {
      if (err.status === 401) {
        await clearSession()
        window.location.href = '/login'
      }
      throw err
    },
  },
})
```

### File Upload

```ts
async function uploadAvatar(file: File, userId: string) {
  const form = new FormData()
  form.append('file', file)
  form.append('userId', userId)

  // Do NOT set Content-Type manually — the browser sets it with the correct
  // multipart boundary automatically when body is FormData.
  const { data } = await api.post<{ url: string }, FormData>(
    '/upload/avatar',
    form
  )

  return data.url
}
```

### Server Component with ISR

```ts
// app/products/page.tsx
import { api } from '@/lib/api'

export default async function ProductsPage() {
  const { data: products } = await api.get<Product[]>('/products', {
    next: {
      revalidate: 600,          // revalidate every 10 minutes
      tags: ['products'],       // allow on-demand purge
    },
  })

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  )
}
```

### Server Action with Tag Revalidation

```ts
// app/actions/product.ts
'use server'
import { revalidateTag } from 'next/cache'
import { api } from '@/lib/api'

export async function deleteProduct(id: string) {
  await api.delete(`/products/${id}`)

  // Bust the 'products' cache tag set in the GET above
  revalidateTag('products')
}

export async function updateProduct(id: string, data: Partial<Product>) {
  await api.patch(`/products/${id}`, data)
  revalidateTag('products')
  revalidateTag(`product-${id}`)
}
```

### Token Refresh on 401

```ts
import { createFetch, FetchError } from '@/lib/$fetch'

let isRefreshing = false

export const api = createFetch({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  interceptors: {
    onRequest: (req) => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        ;(req.init.headers as Record<string, string>)['Authorization'] =
          `Bearer ${token}`
      }
      return req
    },
    onError: async (err) => {
      if (err.status === 401 && !isRefreshing) {
        isRefreshing = true
        try {
          const { data } = await api.post<{ accessToken: string }>(
            '/auth/refresh',
            { token: localStorage.getItem('refreshToken') }
          )
          localStorage.setItem('accessToken', data.accessToken)
          isRefreshing = false
          // Note: retry logic would go here
        } catch {
          isRefreshing = false
          localStorage.clear()
          window.location.href = '/login'
        }
      }
      throw err
    },
  },
})
```
