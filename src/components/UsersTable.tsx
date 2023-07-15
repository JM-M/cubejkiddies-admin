import { useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import Table from './Table';

import { useIonRouter } from '@ionic/react';

type User = {
  name: string;
  date: Date;
};

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (name) => <span className='font-medium'>{name.getValue()}</span>,
  }),
  columnHelper.accessor('date', {
    header: 'Created',
    cell: () => 'May 30, 2023',
  }),
];

const UsersTable = () => {
  const [data, setData] = useState(
    [...Array(10)].map((_, i) => ({
      name: 'John Doe',
      date: new Date(),
    }))
  ); // fake data

  const ionRouter = useIonRouter();

  const goToUser = (row: any) => {
    ionRouter.push(`/users/${row.original.id}`);
  };

  return <Table data={data} columns={columns} onRowClick={goToUser} />;
};

export default UsersTable;
