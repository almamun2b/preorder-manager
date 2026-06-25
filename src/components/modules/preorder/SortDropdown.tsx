'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

interface SortDropdownProps {
  sortBy: string
  setSortBy: (value: string) => void
  sortOrder: 'asc' | 'desc'
  setSortOrder: (value: 'asc' | 'desc') => void
  isDisabled?: boolean
}

const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'createdAt', label: 'Created At' },
  { value: 'startsAt', label: 'Starts At' },
  { value: 'endsAt', label: 'Ends At' },
] as const

export function SortDropdown({
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  isDisabled = false,
}: SortDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={isDisabled}
          variant="outline"
          size="icon"
          className="size-9"
        >
          <ArrowUpDown className="size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40 p-2">
        <DropdownMenuLabel className="text-primary">Sort by</DropdownMenuLabel>

        <RadioGroup
          value={sortBy}
          onValueChange={setSortBy}
          className="gap-0 py-2"
        >
          {sortOptions.map((option) => (
            <Label
              key={option.value}
              htmlFor={`sort-${option.value}`}
              className="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted"
            >
              <RadioGroupItem
                value={option.value}
                id={`sort-${option.value}`}
              />
              <span>{option.label}</span>
            </Label>
          ))}
        </RadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => setSortOrder('asc')}
          onSelect={(e) => e.preventDefault()}
          className={`flex cursor-pointer items-center gap-2 ${
            sortOrder === 'asc'
              ? 'bg-gray-200 data-highlighted:bg-gray-200'
              : ''
          }`}
        >
          <ArrowUp className="h-4 w-4" />
          Ascending
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setSortOrder('desc')}
          onSelect={(e) => e.preventDefault()}
          className={`flex cursor-pointer items-center gap-2 ${
            sortOrder === 'desc'
              ? 'bg-gray-200 data-highlighted:bg-gray-200'
              : ''
          }`}
        >
          <ArrowDown className="h-4 w-4" />
          Descending
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
