import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

interface Props {
  collectionName: string;
  documentId?: string;
}

const getFirestoreDocument = async ({ collectionName, documentId }: Props) => {
  if (!documentId) {
    console.warn(
      `No documentId supplied when trying to fetch from collection: ${collectionName}. You can ignore if this is deliberate.`
    );
    return null;
  }

  const docRef = doc(db, collectionName, documentId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error('Document does not exist!');
  }
  const document = { ...docSnap.data(), id: documentId } as any;
  return document;
};

export default getFirestoreDocument;
