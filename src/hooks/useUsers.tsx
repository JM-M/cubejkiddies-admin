import useFirestoreCollectionQuery from "./useFirestoreCollectionQuery";
import useFirestoreDocumentQuery from "./useFirestoreDocumentQuery";

export interface SortOption {
  field: string;
  reverse?: boolean;
}

interface Props {
  uid?: string;
  sortBy?: SortOption;
}

const collectionName = "users";

const useUsers = (props: Props = {}) => {
  const { uid = "", sortBy = { field: "firstName", reverse: false } } = props;
  const usersQuery = useFirestoreCollectionQuery({
    collectionName,
    orderByField: sortBy.field,
    reverseOrder: sortBy.reverse,
    options: { pageSize: 10 },
  });
  const users = usersQuery.data;

  const userQuery = useFirestoreDocumentQuery({
    collectionName,
    documentId: uid,
  });

  return { users, usersQuery, userQuery };
};

export default useUsers;
