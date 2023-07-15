import { useQueryClient, useMutation } from '@tanstack/react-query';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const useFirestoreDocumentDeletion = ({
  collectionName,
  onSuccess = () => null,
}: {
  collectionName: string;
  onSuccess?: Function;
}) => {
  const queryClient = useQueryClient();

  const deleteFromFirestore = async (documentIds: string[]) => {
    for (let i = 0; i < documentIds.length; i++) {
      const id = documentIds[i];
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    }
    return null;
  };

  const firestoreDocumentDeletion = useMutation({
    mutationKey: ['delete-from-collection', collectionName],
    mutationFn: deleteFromFirestore,
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries(['collection', collectionName]);
    },
  });

  return { firestoreDocumentDeletion };
};

export default useFirestoreDocumentDeletion;
