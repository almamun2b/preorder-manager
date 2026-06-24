'use client'

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
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { DeleteDialog } from './DeleteDialog'
import { SortDropdown } from './SortDropdown'

type Tab = 'all' | 'active' | 'inactive'

const PAGE_SIZE = 5

const allPreorders = [
  {
    id: 1,
    name: 'Multi variant 3',
    products: 1,
    preorderWhen: 'out-of-stock',
    startsAt: 'Dec 15, 2025 08:24 PM',
    endsAt: '',
    status: true,
  },
  {
    id: 2,
    name: 'Multi variant 2',
    products: 1,
    preorderWhen: 'regardless-of-stock',
    startsAt: 'Dec 15, 2025 08:24 PM',
    endsAt: 'Dec 15, 2025 08:27 PM',
    status: false,
  },
  {
    id: 3,
    name: 'Multi variants 1',
    products: 1,
    preorderWhen: 'regardless-of-stock',
    startsAt: 'Dec 15, 2025 08:24 PM',
    endsAt: '',
    status: true,
  },
  {
    id: 4,
    name: 'Partial payment',
    products: 1,
    preorderWhen: 'regardless-of-stock',
    startsAt: 'Aug 17, 2025 04:56 PM',
    endsAt: '',
    status: true,
  },
  {
    id: 5,
    name: 'Shipping not sure',
    products: 1,
    preorderWhen: 'regardless-of-stock',
    startsAt: 'Aug 17, 2025 04:56 PM',
    endsAt: '',
    status: false,
  },
  {
    id: 6,
    name: 'Full payment',
    products: 1,
    preorderWhen: 'regardless-of-stock',
    startsAt: 'Aug 17, 2025 04:56 PM',
    endsAt: '',
    status: true,
  },
  {
    id: 7,
    name: 'Coming soon',
    products: 1,
    preorderWhen: 'regardless-of-stock',
    startsAt: 'Dec 11, 2025 04:42 AM',
    endsAt: '',
    status: true,
  },
  {
    id: 8,
    name: 'With ends',
    products: 1,
    preorderWhen: 'regardless-of-stock',
    startsAt: 'Aug 14, 2025 03:59 PM',
    endsAt: '',
    status: false,
  },
]

export function PreordersTable() {
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<number[]>([])
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const totalPages = Math.ceil(allPreorders.length / PAGE_SIZE)
  const startIndex = (page - 1) * PAGE_SIZE
  const currentData = allPreorders.slice(startIndex, startIndex + PAGE_SIZE)

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(currentData.map((p) => p.id))
    } else {
      setSelected([])
    }
  }

  const toggleSelectRow = (id: number, checked: boolean) => {
    setSelected((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    )
  }

  const onChangeTab = (tab: Tab | string) => {
    setActiveTab(tab as Tab)
    console.log(activeTab, 'activeTab')
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
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </CardHeader>

        <CardContent className="p-0">
          <Table className="w-full">
            <TableHeader className="bg-muted font-bold">
              <TableRow>
                <TableHead className="w-10 px-4">
                  <Checkbox
                    checked={selected.length === currentData.length}
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
              {currentData.map((order) => (
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
                  <TableCell className="font-semibold">{order.name}</TableCell>
                  <TableCell>{order.products}</TableCell>
                  <TableCell>{order.preorderWhen}</TableCell>
                  <TableCell>{order.startsAt}</TableCell>
                  <TableCell>{order.endsAt || '—'}</TableCell>
                  <TableCell>
                    <Switch
                      defaultChecked={order.status}
                      className="h-5.5! w-9! cursor-pointer rounded-md! [&_span]:h-4! [&_span]:w-4! [&_span]:rounded-sm! data-[state=checked]:[&_span]:translate-x-4! data-[state=unchecked]:[&_span]:translate-x-0.5!"
                    />
                  </TableCell>
                  <TableCell className="flex justify-center gap-2 pr-5">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/preorder/${order.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteDialog
                      preorderName={order.name}
                      onConfirm={() => {
                        console.log('Deleting preorder', order.id)
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-center gap-6 bg-muted py-1.5">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              className="rounded-r-none disabled:bg-gray-200"
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <p className="text-sm font-bold text-primary">
              Showing {startIndex + 1} to {startIndex + currentData.length} from{' '}
              {allPreorders.length}
            </p>
            <Button
              variant="outline"
              size="icon"
              disabled={page === totalPages}
              className="rounded-l-none disabled:bg-gray-200"
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
