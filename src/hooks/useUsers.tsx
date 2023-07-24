import useFirestoreCollectionQuery from './useFirestoreCollectionQuery';
import useFirestoreDocumentQuery from './useFirestoreDocumentQuery';

interface Props {
  uid?: string;
}

const collectionName = 'users';

const useUsers = (props: Props = {}) => {
  const { uid = '' } = props;
  const usersQuery = useFirestoreCollectionQuery({
    collectionName,
    orderByField: 'createdAt',
    options: {
      pageSize: 10,
    },
  });

  const userQuery = useFirestoreDocumentQuery({
    collectionName,
    documentId: uid,
  });
  return { usersQuery, userQuery };
};

export default useUsers;
