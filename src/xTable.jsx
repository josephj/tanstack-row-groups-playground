import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { data } from "./data";

const columns = [
  {
    id: "select",
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
    accessorKey: "clientName",
    header: "Client Name",
    enableGrouping: true,
  },
  {
    accessorKey: "invoiceNumber",
    header: "Invoice Number",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => `$${getValue().toFixed(2)}`,
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

function Table() {
  const [grouping, setGrouping] = React.useState(["clientName"]);
  const [rowSelection, setRowSelection] = React.useState({});

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
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{ border: "1px solid #ddd", padding: "8px" }}
                >
                  {header.isPlaceholder ? null : (
                    <div>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanGroup() && (
                        <button
                          onClick={header.column.getToggleGroupingHandler()}
                          style={{
                            cursor: "pointer",
                            marginLeft: "5px",
                          }}
                        >
                          {header.column.getIsGrouped()
                            ? `🛑(${header.column.getGroupedIndex()})`
                            : `👊`}
                        </button>
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
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    <button
                      onClick={row.getToggleExpandedHandler()}
                      style={{
                        cursor: "pointer",
                        marginRight: "5px",
                        background: "none",
                        border: "none",
                        fontSize: "1.2em",
                      }}
                    >
                      {row.getIsExpanded() ? "▲" : "▶"}
                    </button>
                    <strong>{row.groupingValue}</strong> ({row.subRows.length}{" "}
                    invoices)
                  </td>
                </tr>
              );
            }
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  if (cell.column.id === "clientName") {
                    return null; // Hide the client name column in sub-rows
                  }
                  return (
                    <td
                      key={cell.id}
                      style={{ border: "1px solid #ddd", padding: "8px" }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
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
                .flatRows.map((row) => row.original),
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
