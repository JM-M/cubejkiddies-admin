import { IonSearchbar } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import PageLoader from './PageLoader';
import QueryController from './QueryController';
import UsersTable from './UsersTable';
import useUsers from '../hooks/useUsers';

const UsersDisplay = () => {
  const { usersQuery } = useUsers();
  const {
    data = [],
    isLoading,
    fetchNextPage,
    fetchPreviousPage,
    totalPages,
  } = usersQuery;

  if (isLoading) return <PageLoader />;

  return (
    <>
      <div className='w-full my-5 rounded-lg overflow-hidden'>
        <IonSearchbar
          searchIcon={searchOutline}
          slot='end'
          placeholder='Search users'
          className='p-0 text-left'
          color='light'
          animated
          autoFocus
        />
      </div>
      <UsersTable
        users={data}
        onPageNext={fetchNextPage}
        onPagePrev={fetchPreviousPage}
        totalPages={totalPages}
        loading={isLoading}
      />
    </>
  );
};

export default UsersDisplay;
