import { doc, getDoc } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import { db } from '../../firebase';

interface Props {
  collectionName: string;
  documentId?: string;
}

const useFirestoreDocumentQuery = ({ collectionName, documentId }: Props) => {
  const fetchDocument = async ({ queryKey = {} }: any) => {
    const [_key, { collectionName, documentId }] = queryKey;
    if (!documentId) {
      console.warn(
        `No documentId supplied when trying to fetch from collection: ${collectionName}. You can ignore if this is deliberate.`
      );
      return null;
    }

    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: documentId } as any;
    } else {
      // docSnap.data() will be undefined in this case
      throw new Error('Document does not exist!');
    }
  };

  const queryState = useQuery({
    queryKey: ['document', { collectionName, documentId }],
    queryFn: fetchDocument,
    staleTime: Infinity,
  });
  return queryState;
};

export default useFirestoreDocumentQuery;
