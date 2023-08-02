import { useQueryClient, useMutation } from "@tanstack/react-query";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";

const useFirestoreDocumentMutation = ({
  collectionName,
  onSuccess = () => null,
  invalidateCollectionQuery = true,
  invalidateDocumentQuery = true,
}: {
  collectionName: string;
  onSuccess?: Function;
  invalidateCollectionQuery?: boolean;
  invalidateDocumentQuery?: boolean;
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
    const now = Timestamp.fromDate(new Date());
    if (addTimestamp && !document.createdAt) {
      formattedDocument = { ...document, id: documentId, createdAt: now };
    } else if (addTimestamp) {
      formattedDocument = { ...document, id: documentId, updatedAt: now };
    }
    await setDoc(docRef, formattedDocument);
    return { data: formattedDocument, documentId };
  };

  const firestoreDocumentMutation = useMutation({
    mutationKey: ["upload-to-collection", collectionName],
    mutationFn: uploadToFirestore,
    onSuccess: ({ data, documentId }) => {
      onSuccess(data);
      if (invalidateCollectionQuery) {
        queryClient.invalidateQueries(["collection", collectionName]);
      }
      if (invalidateDocumentQuery) {
        queryClient.invalidateQueries([
          "document",
          { collectionName, documentId },
        ]);
      }
    },
  });

  return { firestoreDocumentMutation };
};

export default useFirestoreDocumentMutation;
