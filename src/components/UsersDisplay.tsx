import { useState } from 'react';
import PageLoader from './PageLoader';
import UsersTable from './UsersTable';
import Searchbar from './Searchbar';
import QueryController from './QueryController';
import UserSearchHit from './UserSearchHit';
import useUsers, { SortOption } from '../hooks/useUsers';

const SORT_OPTIONS: { [option: string]: SortOption } = {
  'First name: A - Z': { field: 'firstName', reverse: false },
  'First name: Z - A': { field: 'firstName', reverse: true },
  'Last name: A - Z': { field: 'lastName', reverse: false },
  'Last name: Z - A': { field: 'lastName', reverse: true },
  Newest: { field: 'createdAt', reverse: false },
  Oldest: { field: 'createdAt', reverse: true },
};

const UsersDisplay = () => {
  const [sortOption, setSortOption] = useState<string>();

  const sortBy = sortOption ? SORT_OPTIONS[sortOption] : undefined;

  const { users = [], usersQuery } = useUsers({ sortBy });
  const { isLoading, fetchNextPage, fetchPreviousPage, data = {} } = usersQuery;
  const { totalPages } = data;

  return (
    <>
      <div className='w-full rounded-lg'>
        <Searchbar
          indexName='users'
          hitComponent={UserSearchHit}
          placeholder='Search users'
        />
      </div>
      <div className='flex justify-end my-5'>
        <QueryController
          onSort={setSortOption}
          sortOptions={Object.keys(SORT_OPTIONS)}
        />
      </div>
      {usersQuery.isLoading ? (
        <PageLoader />
      ) : (
        <UsersTable
          users={users}
          onPageNext={fetchNextPage}
          onPagePrev={fetchPreviousPage}
          totalPages={totalPages}
          loading={isLoading}
        />
      )}
    </>
  );
};

export default UsersDisplay;
