'use client'

import { updatePreorderStatus } from '@/app/actions/preorder'
import { TPreordersQueryParams } from '@/backend/modules/preorder/preorders.type'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { date } from '@/lib/date'
import { getQueryParams } from '@/lib/getQueryParams'
import type { PreordersResponse } from '@/types/preorder'
import { ChevronLeft, ChevronRight, Package, Pencil } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { DeleteDialog } from './DeleteDialog'
import { SortDropdown } from './SortDropdown'

type Tab = 'all' | 'active' | 'inactive'

interface PreorderTableProps {
  data: PreordersResponse
}

export function PreordersTable({ data }: PreorderTableProps) {
  const router = useRouter()
  const { data: preorders, meta } = data
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [queryData, setQueryData] = useState<TPreordersQueryParams>({
    status: 'all',
    page: meta?.page || 1,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 8,
  })

  const [selected, setSelected] = useState<string[]>([])

  const isEmpty = preorders?.length === 0

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(preorders?.map((p) => p.id) || [])
    } else {
      setSelected([])
    }
  }

  const toggleSelectRow = (id: string, checked: boolean) => {
    setSelected((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    )
  }

  const navigate = (newParams: Partial<TPreordersQueryParams>) => {
    const updated = { ...queryData, ...newParams }
    setQueryData(updated)
    router.push(`/preorder?${getQueryParams(updated)}`)
  }

  const onChangeTab = (tab: string) => {
    navigate({ status: tab as Tab, page: 1 })
  }

  const goPreviousPage = () => {
    navigate({ page: queryData.page! - 1 })
  }

  const goNextPage = () => {
    navigate({ page: queryData.page! + 1 })
  }

  const onSortByChange = (value: TPreordersQueryParams['sortBy']) => {
    navigate({ sortBy: value, page: 1 })
  }

  const onSortOrderChange = (value: TPreordersQueryParams['sortOrder']) => {
    navigate({ sortOrder: value, page: 1 })
  }

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      setPendingId(id)
      const result = await updatePreorderStatus(id, !currentStatus)
      if (result.success) {
        toast.success('Status updated successfully')
        // router.refresh()
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update status'
      )
    } finally {
      setPendingId(null)
    }
  }

  return (
    <section className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Preorders</h1>
        <Button asChild>
          <Link href="/preorder/create">Create Preorder</Link>
        </Button>
      </div>

      <Card className="gap-0 p-0">
        <CardHeader className="mb-1 flex items-center justify-between border-b px-4 py-3!">
          <Tabs defaultValue="all" onValueChange={onChangeTab}>
            <TabsList className="gap-1 bg-transparent p-0 group-data-horizontal/tabs:h-8">
              <TabsTrigger
                className="px-4 text-primary hover:bg-muted data-active:bg-muted"
                value="all"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                className="px-4 text-primary hover:bg-muted data-active:bg-muted"
                value="active"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                className="px-4 text-primary hover:bg-muted data-active:bg-muted"
                value="inactive"
              >
                Inactive
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <SortDropdown
            sortBy={queryData.sortBy}
            setSortBy={onSortByChange}
            sortOrder={queryData.sortOrder}
            setSortOrder={onSortOrderChange}
            isDisabled={isEmpty}
          />
        </CardHeader>

        <CardContent className="p-0">
          <Table className="w-full">
            <TableHeader className="bg-muted font-bold">
              <TableRow>
                <TableHead className="w-10 px-4">
                  <Checkbox
                    disabled={isEmpty}
                    checked={selected.length === preorders?.length && !isEmpty}
                    className="size-4.5 border-primary/50 bg-white"
                    onCheckedChange={(checked) =>
                      toggleSelectAll(checked as boolean)
                    }
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Preorder when</TableHead>
                <TableHead>Starts at</TableHead>
                <TableHead>Ends at</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-30 pr-5 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="[&_tr:last-child]:border-b">
              {isEmpty ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-[420px] p-0">
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="mb-6 rounded-full bg-muted p-4">
                        <Package className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold">
                        No preorders found
                      </h3>
                      <p className="mb-6 max-w-sm whitespace-normal text-muted-foreground">
                        You haven&apos;t created any preorders yet. Create your
                        first preorder to get started.
                      </p>
                      <Button asChild>
                        <Link href="/preorder/create">Create Preorder</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                preorders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="px-4">
                      <Checkbox
                        checked={selected.includes(order.id)}
                        className="size-4.5 border-primary/50"
                        onCheckedChange={(checked) =>
                          toggleSelectRow(order.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-semibold">
                      {order.name}
                    </TableCell>
                    <TableCell>{order.products}</TableCell>
                    <TableCell>{order.preorderWhen.toLowerCase()}</TableCell>
                    <TableCell>
                      {order.startsAt ? date.utcToLocal(order.startsAt) : '—'}
                    </TableCell>
                    <TableCell>
                      {order.endsAt ? date.utcToLocal(order.endsAt) : '—'}
                    </TableCell>
                    <TableCell>
                      <Switch
                        disabled={pendingId === order.id}
                        checked={order.status}
                        onCheckedChange={() =>
                          handleStatusToggle(order.id, order.status)
                        }
                        className="h-5.5! w-9! cursor-pointer rounded-md! [&_span]:h-4! [&_span]:w-4! [&_span]:rounded-sm! data-[state=checked]:[&_span]:translate-x-4! data-[state=unchecked]:[&_span]:translate-x-0.5!"
                      />
                    </TableCell>
                    <TableCell className="flex justify-center gap-2 pr-5">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/preorder/${order.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteDialog preorderName={order.name} id={order.id} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {!isEmpty && meta && (
            <div className="flex items-center justify-center gap-6 bg-muted py-1.5">
              <Button
                variant="outline"
                size="icon"
                disabled={queryData.page === 1}
                className="rounded-r-none disabled:bg-gray-200"
                onClick={goPreviousPage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <p className="text-sm font-bold text-primary">
                Showing {meta.limit * (meta?.page - 1) + 1} to{' '}
                {Math.min(meta.limit * meta.page, meta.total)} from {meta.total}
              </p>
              <Button
                variant="outline"
                size="icon"
                disabled={meta.page === meta.totalPage}
                className="rounded-l-none disabled:bg-gray-200"
                onClick={goNextPage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
