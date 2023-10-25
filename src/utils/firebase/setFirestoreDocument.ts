import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const setFirestoreDocument = async (docData = {}) => {
  const {
    collectionName,
    document,
    documentId,
    addTimestamp = false,
  } = docData;
  if (!documentId)
    throw new Error('[InternalServerError] No document id provided.');
  if (!document) throw new Error('[InternalServerError] No document provided.');
  if (!collectionName)
    throw new Error('[InternalServerError] No collection name provided.');

  const docRef = doc(db, collectionName, documentId);
  let formattedDocument = document;
  if (addTimestamp && !document.createdAt) {
    const createdAt = Timestamp.fromDate(new Date());
    formattedDocument = { ...document, id: documentId, createdAt };
  }
  await setDoc(docRef, formattedDocument);
  return formattedDocument;
};

export default setFirestoreDocument;
