import { useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import Table from './Table';

import Status from './Status';
import { useIonRouter } from '@ionic/react';

type Order = {
  name: string;
  price: number;
  quantity: number;
};

const columnHelper = createColumnHelper<Order>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (name) => <span className='font-medium'>{name.getValue()}</span>,
    footer: () => <span className='block mt-3 text-left'>Total</span>,
  }),
  columnHelper.accessor('price', {
    header: 'Unit Price',
    cell: (price) => `N ${price.getValue()}`,
  }),
  columnHelper.accessor('quantity', {
    header: 'Quantity',
  }),
  columnHelper.accessor('price', {
    header: 'Price',
    cell: (price) => `N ${price.getValue()}`,
    footer: () => <span className='block mt-3 text-right'>N 30,000</span>,
  }),
];

const OrderCartTable = () => {
  const [data, setData] = useState(
    [...Array(3)].map((_) => ({
      name: "Boy's Shoe",
      quantity: [1, 2, 3][Math.floor(Math.random() * 3)],
      price: Math.ceil(Math.random() * 10) * 500,
    }))
  ); // fake data

  const ionRouter = useIonRouter();

  const goToOrder = (row: any) => {
    // ionRouter.push(`/products/${row.original.id}`);
  };

  return (
    <Table
      data={data}
      columns={columns}
      onRowClick={goToOrder}
      hideNavigation
    />
  );
};

export default OrderCartTable;
