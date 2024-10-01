import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  flexRender,
  Row,
} from '@tanstack/react-table';
// @ts-ignore
import { data } from './data';
import { columns } from './columns';

interface Invoice {
  clientName: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: string;
}

function Table() {
  const [grouping, setGrouping] = React.useState<string[]>(['clientName']);
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});

  const table = useReactTable({
    data,
    columns,
    state: {
      grouping,
      expanded: true,
      rowSelection,
    },
    onGroupingChange: setGrouping,
    onRowSelectionChange: setRowSelection,
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  });

  return (
    <div>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{ border: '1px solid #ddd', padding: '8px' }}
                >
                  {header.isPlaceholder ? null : (
                    <div>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            if (row.getIsGrouped()) {
              return (
                <tr key={row.id}>
                  <td
                    colSpan={row.getVisibleCells().length}
                    style={{
                      border: '1px solid #ddd',
                      padding: '8px',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                    onClick={row.getToggleExpandedHandler()}
                  >
                    <input
                      type="checkbox"
                      checked={row.getIsSelected()}
                      onChange={row.getToggleSelectedHandler()}
                      onClick={(e) => e.stopPropagation()}
                      style={{ marginRight: '5px' }}
                    />
                    <span style={{ marginRight: '5px' }}>
                      {row.getIsExpanded() ? '▼' : '▶'}
                    </span>
                    <strong>{row.groupingValue as string}</strong> (
                    {row.subRows.length} invoices)
                  </td>
                </tr>
              );
            }
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{ border: '1px solid #ddd', padding: '8px' }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <h4>Selected Invoices:</h4>
        <pre>
          {JSON.stringify(
            {
              selectedInvoices: table
                .getSelectedRowModel()
                .flatRows.map((row: Row<Invoice>) => row.original),
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}

export default Table;
