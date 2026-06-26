'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod/v3'

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Preorder name is required' })
    .max(255, { message: 'Preorder name must be less than 255 characters' }),
  products: z.string().min(1, 'Product number is required'),
  preorderWhen: z.enum(['REGARDLESS_OF_STOCK', 'OUT_OF_STOCK'], {
    message:
      "Preorder condition must be either 'REGARDLESS_OF_STOCK' or 'OUT_OF_STOCK'",
  }),
  startsAt: z.string().nullable().optional(),
  endsAt: z.string().nullable().optional(),
  status: z.boolean({ message: 'Status must be true or false' }).optional(),
})

type FormSchemaType = z.infer<typeof formSchema>

interface PreorderFormProps {
  data?: FormSchemaType
}

const PreorderForm = ({ data }: PreorderFormProps) => {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name ?? '',
      products: data?.products ?? '1',
      preorderWhen: data?.preorderWhen ?? 'REGARDLESS_OF_STOCK',
      startsAt: data?.startsAt ?? '',
      endsAt: data?.endsAt ?? '',
      status: data?.status ?? true,
    },
    mode: 'onChange',
  })

  const onSubmit = (data: FormSchemaType) => {
    console.log(data)
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 pb-4">
      <div className="flex items-center justify-between font-medium">
        <Button
          variant="outline"
          asChild
          className="h-9 px-3"
          onClick={() => form.reset()}
        >
          <Link href="/preorder">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="h-9 px-3">
            <Link href="/preorder">Cancel</Link>
          </Button>
          <Button type="submit" className="h-9 px-3" form="form-preorder">
            Save changes
          </Button>
        </div>
      </div>

      <Card className="gap-0 p-0 shadow-xl">
        <CardHeader className="border-b p-5">
          <CardTitle className="font-semibold">Preorder details</CardTitle>
          <CardDescription>
            These values appear in the preorders list.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5">
          <form id="form-preorder" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-0 divide-y">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation="responsive"
                    className="grid grid-cols-1 items-start gap-4 py-6 lg:grid-cols-[260px_1fr]"
                  >
                    <FieldContent className="flex flex-col gap-1">
                      <FieldLabel htmlFor={field.name}>
                        Name <span className="text-destructive">*</span>
                      </FieldLabel>
                      <FieldDescription>
                        A label to recognize this preorder by.
                      </FieldDescription>
                    </FieldContent>
                    <div className="flex flex-col gap-1">
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Summer Collection Preorder"
                        autoComplete="on"
                        className="h-10 max-w-md"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </div>
                  </Field>
                )}
              />

              <Controller
                name="products"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation="responsive"
                    className="grid grid-cols-1 items-start gap-4 py-6 lg:grid-cols-[260px_1fr]"
                  >
                    <FieldContent className="flex flex-col gap-1">
                      <FieldLabel htmlFor={field.name}>Products</FieldLabel>
                      <FieldDescription>
                        Number of products covered by this preorder.
                      </FieldDescription>
                    </FieldContent>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-4">
                        <Input
                          {...field}
                          id={field.name}
                          type="number"
                          min={1}
                          aria-invalid={fieldState.invalid}
                          className="h-10 w-40 max-w-md"
                        />
                        <span className="text-sm text-muted-foreground">
                          product(s)
                        </span>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </div>
                  </Field>
                )}
              />

              <Controller
                name="preorderWhen"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation="responsive"
                    className="grid grid-cols-1 items-start gap-4 py-6 lg:grid-cols-[260px_1fr]"
                  >
                    <FieldContent className="flex flex-col gap-1">
                      <FieldLabel htmlFor={field.name}>
                        Preorder when
                      </FieldLabel>
                      <FieldDescription>
                        When customers are allowed to preorder.
                      </FieldDescription>
                    </FieldContent>
                    <div className="flex flex-col gap-1">
                      <Select
                        {...field}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          className="h-10! w-full max-w-md"
                        >
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="REGARDLESS_OF_STOCK">
                            Regardless of stock
                          </SelectItem>
                          <SelectItem value="OUT_OF_STOCK">
                            Only when out of stock
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </div>
                  </Field>
                )}
              />

              <Controller
                name="startsAt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation="responsive"
                    className="grid grid-cols-1 items-start gap-4 py-6 lg:grid-cols-[260px_1fr]"
                  >
                    <FieldContent className="flex flex-col gap-1">
                      <FieldLabel htmlFor={field.name}>Starts at</FieldLabel>
                      <FieldDescription>
                        When the preorder window opens.
                      </FieldDescription>
                    </FieldContent>
                    <div className="flex flex-col gap-1">
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        id={field.name}
                        type="datetime-local"
                        aria-invalid={fieldState.invalid}
                        className="h-10 w-full max-w-md"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </div>
                  </Field>
                )}
              />

              <Controller
                name="endsAt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation="responsive"
                    className="grid grid-cols-1 items-start gap-4 py-6 lg:grid-cols-[260px_1fr]"
                  >
                    <FieldContent className="flex flex-col gap-1">
                      <FieldLabel htmlFor={field.name}>Ends at</FieldLabel>
                      <FieldDescription>
                        Leave empty for no end date.
                      </FieldDescription>
                    </FieldContent>
                    <div className="flex flex-col gap-1">
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        id={field.name}
                        type="datetime-local"
                        aria-invalid={fieldState.invalid}
                        className="h-10 w-full max-w-md"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </div>
                  </Field>
                )}
              />

              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation="responsive"
                    className="grid grid-cols-1 items-center gap-4 py-6 lg:grid-cols-[260px_1fr]"
                  >
                    <FieldContent className="flex flex-col gap-1">
                      <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                      <FieldDescription>
                        Active preorders are visible to customers.
                      </FieldDescription>
                    </FieldContent>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <Switch
                          id={field.name}
                          name={field.name}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-invalid={fieldState.invalid}
                          className="h-5.5! w-9! cursor-pointer rounded-md! [&_span]:h-4! [&_span]:w-4! [&_span]:rounded-sm! data-[state=checked]:[&_span]:translate-x-4! data-[state=unchecked]:[&_span]:translate-x-0.5!"
                        />
                        <span className="text-sm font-medium text-muted-foreground">
                          Active
                        </span>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </div>
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="border-t-2 bg-transparent p-5">
          <Field orientation="horizontal" className="justify-end gap-2">
            <Button
              variant="outline"
              asChild
              className="h-9 px-3"
              onClick={() => form.reset()}
            >
              <Link href="/preorder">Cancel</Link>
            </Button>
            <Button type="submit" form="form-preorder" className="h-9 px-3">
              Save changes
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  )
}

export { PreorderForm }
