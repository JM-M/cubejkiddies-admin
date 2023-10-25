import { useState } from 'react';
import { useIonRouter } from '@ionic/react';
import { createColumnHelper } from '@tanstack/react-table';
import { Timestamp } from 'firebase/firestore';
import { formatDistance } from 'date-fns';
import Table from './Table';
import Status from './Status';
import PageLoader from './PageLoader';
import useOrders from '../hooks/useOrders';
import { Order } from '../hooks/useOrders';

const columnHelper = createColumnHelper<Order>();

const columns = [
  columnHelper.accessor('id', {
    header: 'Order ID',
    cell: (id) => <span className='font-medium'>#{id.getValue()}</span>,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Date',
    cell: ({
      row: {
        original: { createdAt },
      },
    }) => {
      return formatDistance(createdAt!.toDate(), new Date(), {
        addSuffix: true,
      });
    },
  }),
  columnHelper.accessor('statusEvents', {
    header: 'Status',
    cell: ({
      row: {
        original: { statusEvents = [], terminalOrderPlaced, paymentVerified },
      },
    }) => {
      if (!statusEvents?.length) return null;
      const { status } = statusEvents[statusEvents.length - 1];
      return <Status status={status} />;
    },
  }),
];

const OrdersTable = () => {
  const ionRouter = useIonRouter();

  const { orders, ordersQuery } = useOrders();

  const goToOrder = (row: any) => {
    ionRouter.push(`/orders/${row.original.id}`);
  };

  if (ordersQuery.isLoading) return <PageLoader />;

  return <Table data={orders} columns={columns} onRowClick={goToOrder} />;
};

export default OrdersTable;
