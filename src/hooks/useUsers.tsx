import useFirestoreCollectionQuery from "./useFirestoreCollectionQuery";
import useFirestoreDocumentQuery from "./useFirestoreDocumentQuery";

interface Props {
  uid?: string;
}

const collectionName = "users";

const useUsers = (props: Props = {}) => {
  const { uid = "" } = props;
  const usersQuery = useFirestoreCollectionQuery({
    collectionName,
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
