"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { ArrowUpDown, Columns, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TagDto } from "@/lib/api/generated";

type TagTableProps = {
  items: TagDto[];
  onEdit?: (tag: TagDto) => void;
  onDelete?: (tag: TagDto) => void;
  filters?: React.ReactNode;
  sortKey?: string | null;
  onSortChange?: (value: string | null) => void;
};

export function TagTable({ items, onEdit, onDelete, filters, sortKey, onSortChange }: TagTableProps) {
  const data = React.useMemo(() => items ?? [], [items]);
  const [sorting, setSortingState] = React.useState<SortingState>(() => resolveSortingState(sortKey));

  React.useEffect(() => {
    setSortingState((previous) => {
      const next = resolveSortingState(sortKey);
      return isSameSorting(previous, next) ? previous : next;
    });
  }, [sortKey]);

  const handleSortingChange = React.useCallback(
    (updater: SortingState | ((state: SortingState) => SortingState)) => {
      setSortingState((current) => {
        const next = typeof updater === "function" ? updater(current) : updater;
        const key = extractSortKey(next);
        onSortChange?.(key);
        return next;
      });
    },
    [onSortChange]
  );

  const columns = React.useMemo<ColumnDef<TagDto>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 44
      },
      {
        accessorKey: "tagName",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Tag
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const rawName = row.original.tagName?.trim() ?? "";
          const displayName = rawName || "Tag";
          const description = row.original.description?.trim();

          return (
            <div className="flex flex-col">
              <span className="font-medium">{displayName}</span>
              {description ? (
                <span className="text-sm text-muted-foreground">{description}</span>
              ) : null}
            </div>
          );
        }
      },
      {
        accessorKey: "tagSource",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Source
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => row.original.tagSource ?? "-"
      },
      {
        accessorKey: "tagType",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) =>
          row.original.tagType ? <Badge>{row.original.tagType}</Badge> : <span>-</span>
      },
      {
        accessorKey: "tagMode",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Mode
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) =>
          row.original.tagMode ? (
            <Badge variant="secondary">{row.original.tagMode}</Badge>
          ) : (
            <span>-</span>
          )
      },
      {
        accessorKey: "unit",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Eng. unit
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => row.original.unit ?? "-"
      },
      {
        id: "created",
        accessorFn: (row) => row.createdAt ?? row.updatedAt ?? null,
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        sortingFn: (rowA, rowB, columnId) => {
          const valueA = toTimestamp(rowA.getValue(columnId));
          const valueB = toTimestamp(rowB.getValue(columnId));
          return valueA - valueB;
        },
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {resolveDate(row.original.createdAt) ?? resolveDate(row.original.updatedAt) ?? "-"}
          </span>
        ),
        sortDescFirst: true
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  onEdit?.(row.original);
                }}>
                Edit tag
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  onDelete?.(row.original);
                }}>
                Delete tag
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    ],
    [onEdit, onDelete]
  );

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    },
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-4 py-4">
        <div className="flex flex-1 flex-wrap items-center gap-2">{filters}</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto gap-2">
              <Columns className="h-4 w-4" />
              <span className="hidden md:inline">Columns</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function resolveDate(input?: string | null) {
  if (!input) return null;
  try {
    return format(new Date(input), "yyyy-MM-dd HH:mm");
  } catch (error) {
    return null;
  }
}

function resolveSortingState(sortKey?: string | null): SortingState {
  switch (sortKey) {
    case "name-asc":
      return [{ id: "tagName", desc: false }];
    case "name-desc":
      return [{ id: "tagName", desc: true }];
    case "created-asc":
      return [{ id: "created", desc: false }];
    case "created-desc":
      return [{ id: "created", desc: true }];
    default:
      return [{ id: "tagName", desc: false }];
  }
}

function extractSortKey(state: SortingState): string | null {
  const current = state[0];
  if (!current) return null;
  if (current.id === "tagName") {
    return current.desc ? "name-desc" : "name-asc";
  }
  if (current.id === "created") {
    return current.desc ? "created-desc" : "created-asc";
  }
  return null;
}

function isSameSorting(a: SortingState, b: SortingState) {
  if (a.length !== b.length) return false;
  return a.every((entry, index) => entry.id === b[index]?.id && entry.desc === b[index]?.desc);
}

function toTimestamp(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const time = Date.parse(value);
    return Number.isFinite(time) ? time : 0;
  }
  if (value instanceof Date) return value.getTime();
  if (!value || value === null) return 0;
  return 0;
}
