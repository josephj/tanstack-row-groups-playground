import type { ColumnDef } from '@tanstack/react-table';
// @ts-ignore
import type { Invoice } from './data';

export const columns: ColumnDef<Invoice>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        disabled={row.getIsGrouped()}
      />
    ),
  },
  {
    accessorKey: 'clientName',
    header: ({ column }) => (
      <div>
        Client Name
        <button
          onClick={column.getToggleGroupingHandler()}
          style={{
            cursor: 'pointer',
            marginLeft: '5px',
          }}
        >
          {column.getIsGrouped() ? `🛑(${column.getGroupedIndex()})` : `👊`}
        </button>
      </div>
    ),
    enableGrouping: true,
  },
  {
    accessorKey: 'invoiceNumber',
    header: 'Invoice Number',
    enableGrouping: false,
  },
  {
    accessorKey: 'date',
    header: 'Date',
    enableGrouping: false,
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ getValue }) => `$${(getValue() as number).toFixed(2)}`,
    enableGrouping: false,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableGrouping: false,
  },
];
