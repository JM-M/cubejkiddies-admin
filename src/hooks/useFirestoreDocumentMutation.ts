import { useQueryClient, useMutation } from '@tanstack/react-query';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';

const useFirestoreDocumentMutation = ({
  collectionName,
  onSuccess = () => null,
}: {
  collectionName: string;
  onSuccess?: Function;
}) => {
  const queryClient = useQueryClient();

  const uploadToFirestore = async ({
    document,
    documentId,
    addTimestamp = false,
  }: {
    document: any;
    documentId: string;
    addTimestamp?: boolean;
  }) => {
    const docRef = doc(db, collectionName, documentId);
    let formattedDocument = document;
    if (addTimestamp && !document.createdAt) {
      const createdAt = Timestamp.fromDate(new Date());
      formattedDocument = { ...document, createdAt };
    }
    const data = await setDoc(docRef, formattedDocument);
    return { data, documentId };
  };

  const firestoreDocumentMutation = useMutation({
    mutationKey: ['upload-to-collection', collectionName],
    mutationFn: uploadToFirestore,
    onSuccess: ({ data, documentId }) => {
      onSuccess(data);
      queryClient.invalidateQueries(['collection', collectionName]);
      queryClient.invalidateQueries([
        'document',
        { collectionName, documentId },
      ]);
    },
  });

  return { firestoreDocumentMutation };
};

export default useFirestoreDocumentMutation;
