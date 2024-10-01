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
import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Box,
  Text,
  TableContainer,
  VStack,
  Heading,
} from '@chakra-ui/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
    <VStack spacing={4} align="stretch" marginY={10}>
      <Heading as="h1" size="xl" textAlign="center" mb={6}>
        TanStack Table Grouping
      </Heading>

      <TableContainer
        border="1px solid #e2e8f0"
        borderRadius={10}
        width="1200px"
        maxWidth="90%"
        marginX="auto"
      >
        <ChakraTable variant="simple" colorScheme="gray">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isGroupedByClient = grouping.includes('clientName');
                  if (isGroupedByClient && header.column.id === 'select') {
                    return (
                      <Th key={header.id} colSpan={2}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {flexRender(
                          columns.find((col) => col.id === 'clientName')
                            ?.header,
                          header.getContext()
                        )}
                      </Th>
                    );
                  }
                  if (isGroupedByClient && header.column.id === 'clientName') {
                    return null;
                  }
                  return (
                    <Th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <Box>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </Box>
                      )}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => {
              if (row.getIsGrouped()) {
                return (
                  <Tr key={row.id}>
                    <Td
                      backgroundColor="gray.100"
                      colSpan={row.getVisibleCells().length}
                      cursor="pointer"
                      onClick={row.getToggleExpandedHandler()}
                    >
                      <Checkbox
                        background="#ffffff"
                        isChecked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        onClick={(e) => e.stopPropagation()}
                        mr={2}
                      />
                      <Text as="strong" display="inline-block">
                        {row.groupingValue as string}
                      </Text>{' '}
                      ({row.subRows.length} invoices)
                    </Td>
                  </Tr>
                );
              }
              return (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const isGroupedByClient = grouping.includes('clientName');
                    if (cell.column.id === 'select') {
                      return (
                        <Td key={cell.id} colSpan={isGroupedByClient ? 2 : 1}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Td>
                      );
                    }
                    if (cell.column.id === 'clientName' && isGroupedByClient) {
                      return null;
                    }
                    return (
                      <Td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </ChakraTable>
      </TableContainer>

      <Box width="1200px" marginX="auto" maxWidth="90%" fontSize="12px">
        <Heading as="h4" size="md" mb={2}>
          Selected Invoices:
        </Heading>
        <SyntaxHighlighter language="json" style={atomDark}>
          {JSON.stringify(
            {
              selectedInvoices: table
                .getSelectedRowModel()
                .flatRows.map((row: Row<Invoice>) => row.original),
            },
            null,
            2
          )}
        </SyntaxHighlighter>
      </Box>
    </VStack>
  );
}

export default Table;
