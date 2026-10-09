<script lang="ts" generics="TData">
  import {
    createTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    type ColumnDef,
    type SortingState,
    type TableOptions
  } from '@tanstack/table-core';
  import {
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    ChevronLeft,
    ChevronRight,
    Search
  } from 'lucide-svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    data: TData[];
    columns: ColumnDef<TData, any>[];
    searchPlaceholder?: string;
    onRowClick?: (row: TData) => void;
    actions?: Snippet;
    cellSnippet?: Snippet<[{ cell: any; row: any; value: any }]>;
  }

  let {
    data,
    columns,
    searchPlaceholder = 'Filter records...',
    onRowClick,
    actions,
    cellSnippet
  }: Props = $props();

  let sorting = $state<SortingState>([]);
  let globalFilter = $state<string>('');
  let pagination = $state({
    pageIndex: 0,
    pageSize: 10
  });

  const table = createTable({
    get data() {
      return data;
    },
    get columns() {
      return columns;
    },
    state: {
      columnPinning: { left: [], right: [] },
      rowPinning: { top: [], bottom: [] },
      columnFilters: [],
      columnVisibility: {},
      columnOrder: [],
      columnSizing: {},
      expanded: {},
      grouping: [],
      rowSelection: {},
      get sorting() {
        return sorting;
      },
      get globalFilter() {
        return globalFilter;
      },
      get pagination() {
        return pagination;
      }
    },
    onSortingChange: (updater) => {
      sorting = typeof updater === 'function' ? updater(sorting) : updater;
    },
    onGlobalFilterChange: (updater) => {
      globalFilter = typeof updater === 'function' ? updater(globalFilter) : updater;
    },
    onPaginationChange: (updater) => {
      pagination = typeof updater === 'function' ? updater(pagination) : updater;
    },
    onStateChange: () => {},
    renderFallbackValue: null,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const rows = $derived(table.getRowModel().rows);
  const headerGroups = $derived(table.getHeaderGroups());
  const canPreviousPage = $derived(table.getCanPreviousPage());
  const canNextPage = $derived(table.getCanNextPage());
  const pageCount = $derived(table.getPageCount());
  const totalRows = $derived(table.getFilteredRowModel().rows.length);
</script>

<div class="space-y-3">
  <!-- Table Controls Bar -->
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
    <!-- Global Filter Input -->
    <div class="relative flex-1 max-w-sm">
      <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
      <input
        type="text"
        bind:value={globalFilter}
        placeholder={searchPlaceholder}
        class="w-full pl-8 pr-3 py-1.5 rounded-none bg-surface border border-border text-xs text-ink placeholder-ink-muted focus:outline-hidden focus:border-brand font-mono"
      />
    </div>

    <!-- Actions & Pagination Metadata -->
    <div class="flex flex-wrap items-center gap-3 text-xs font-mono text-ink-secondary">
      {#if actions}
        {@render actions()}
      {/if}

      <span class="text-ink-muted">
        Showing {totalRows === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1}–{Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalRows)} of {totalRows}
      </span>

      <div class="flex items-center gap-1.5">
        <label for="page-size" class="text-ink-muted">Per page:</label>
        <select
          id="page-size"
          value={pagination.pageSize}
          onchange={(e) => {
            const size = Number((e.target as HTMLSelectElement).value);
            table.setPageSize(size);
          }}
          class="px-2 py-1 rounded-none bg-surface border border-border text-ink cursor-pointer focus:outline-hidden focus:border-brand"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  </div>

  <!-- High-Density Headless Data Grid (0px Outer Radius for Structural Table) -->
  <div class="rounded-none border border-border overflow-hidden bg-surface">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs font-mono">
        <thead>
          {#each headerGroups as headerGroup}
            <tr class="border-b border-border bg-surface-subtle text-ink-muted">
              {#each headerGroup.headers as header}
                <th class="p-3 font-semibold select-none">
                  {#if !header.isPlaceholder}
                    {#if header.column.getCanSort()}
                      <button
                        type="button"
                        onclick={header.column.getToggleSortingHandler()}
                        class="flex items-center gap-1.5 hover:text-ink transition-colors cursor-pointer w-full text-left font-mono"
                      >
                        <span>
                          {typeof header.column.columnDef.header === 'function'
                            ? header.column.columnDef.header(header.getContext())
                            : header.column.columnDef.header}
                        </span>
                        {#if header.column.getIsSorted() === 'asc'}
                          <ChevronUp class="w-3.5 h-3.5 text-brand shrink-0" />
                        {:else if header.column.getIsSorted() === 'desc'}
                          <ChevronDown class="w-3.5 h-3.5 text-brand shrink-0" />
                        {:else}
                          <ChevronsUpDown class="w-3 h-3 text-ink-muted/50 shrink-0 opacity-40 group-hover:opacity-100" />
                        {/if}
                      </button>
                    {:else}
                      <span>
                        {typeof header.column.columnDef.header === 'function'
                          ? header.column.columnDef.header(header.getContext())
                          : header.column.columnDef.header}
                      </span>
                    {/if}
                  {/if}
                </th>
              {/each}
            </tr>
          {/each}
        </thead>
        <tbody class="divide-y divide-border">
          {#if rows.length === 0}
            <tr>
              <td colspan={columns.length} class="p-8 text-center text-ink-muted font-sans">
                No matching records located in directory.
              </td>
            </tr>
          {:else}
            {#each rows as row}
              <tr
                onclick={() => onRowClick?.(row.original)}
                class="hover:bg-surface-subtle transition-colors {onRowClick ? 'cursor-pointer' : ''}"
              >
                {#each row.getVisibleCells() as cell}
                  <td class="p-3 text-ink">
                    {#if cellSnippet}
                      {@render cellSnippet({ cell, row, value: cell.getValue() })}
                    {:else if typeof cell.column.columnDef.cell === 'function'}
                      {@const rendered = cell.column.columnDef.cell(cell.getContext())}
                      {rendered}
                    {:else}
                      {cell.getValue()}
                    {/if}
                  </td>
                {/each}
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Pagination Controls Strip -->
  {#if pageCount > 1}
    <div class="flex items-center justify-between text-xs font-mono pt-1 text-ink-secondary">
      <div>
        <span>Page {pagination.pageIndex + 1} of {pageCount}</span>
      </div>

      <div class="flex items-center gap-1">
        <button
          type="button"
          onclick={() => table.previousPage()}
          disabled={!canPreviousPage}
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-none border border-border bg-surface hover:bg-surface-subtle disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ChevronLeft class="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>

        <button
          type="button"
          onclick={() => table.nextPage()}
          disabled={!canNextPage}
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-none border border-border bg-surface hover:bg-surface-subtle disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  {/if}
</div>
