import PageLoader from "./PageLoader";
import UsersTable from "./UsersTable";
import Searchbar from "./Searchbar";
import UserSearchHit from "./UserSearchHit";
import useUsers from "../hooks/useUsers";

const UsersDisplay = () => {
  const { users = [], usersQuery } = useUsers();
  const { isLoading, fetchNextPage, fetchPreviousPage, totalPages } =
    usersQuery;

  if (isLoading) return <PageLoader />;

  return (
    <>
      <div className="w-full my-5 rounded-lg overflow-hidden">
        <Searchbar
          indexName="products"
          hitComponent={UserSearchHit}
          placeholder="Search users"
        />
      </div>
      <UsersTable
        users={users}
        onPageNext={fetchNextPage}
        onPagePrev={fetchPreviousPage}
        totalPages={totalPages}
        loading={isLoading}
      />
    </>
  );
};

export default UsersDisplay;
