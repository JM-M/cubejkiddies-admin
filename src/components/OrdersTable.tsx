import { useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import Table from './Table';

import Status from './Status';
import { useIonRouter } from '@ionic/react';

type Order = {
  orderId: string;
  date: Date;
  status: string;
  totalPrice: number;
};

const columnHelper = createColumnHelper<Order>();

const columns = [
  columnHelper.accessor('orderId', {
    header: 'Order ID',
    cell: (orderId) => (
      <span className='font-medium'>#{orderId.getValue()}</span>
    ),
  }),
  columnHelper.accessor('date', {
    header: 'Date',
    cell: () => 'May 30, 2023',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (status) => <Status status={status.getValue()} />,
  }),
  columnHelper.accessor('totalPrice', {
    header: 'Total',
    cell: (totalPrice) => `N ${totalPrice.getValue()}`,
  }),
];

const OrdersTable = () => {
  const [data, setData] = useState(
    [...Array(10)].map((_) => ({
      orderId: Math.trunc(Math.random() * 999999).toString(),
      date: new Date(),
      status: ['confirmed', 'en-route', 'delivered'][
        Math.floor(Math.random() * 3)
      ],
      totalPrice: Math.ceil(Math.random() * 10) * 500,
    }))
  ); // fake data

  const ionRouter = useIonRouter();

  const goToOrder = (row: any) => {
    ionRouter.push(`/orders/${row.original.orderId}`);
  };

  return <Table data={data} columns={columns} onRowClick={goToOrder} />;
};

export default OrdersTable;
