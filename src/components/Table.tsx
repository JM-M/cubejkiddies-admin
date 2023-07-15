import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

const Table: React.FC<{
  data: any[];
  columns: any[];
  onRowClick?: Function;
  hideNavigation?: boolean;
}> = ({ data, columns, onRowClick = () => null }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <table className='w-full text-sm text-gray-700'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className='h-[50px] text-gray-500  border-b border-gray-300'
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className='px-1 font-medium text-left last:text-right'
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className='h-[50px] border-b border-gray-300'
              onClick={() => onRowClick(row)}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className='px-1 last:text-right'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup, i) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
};

export default Table;
