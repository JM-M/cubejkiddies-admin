import { useQueryClient, useMutation } from "@tanstack/react-query";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import useAlgolia from "./useAlgolia";

const useFirestoreDocumentMutation = ({
  collectionName,
  onSuccess = () => null,
  invalidateCollectionQuery = true,
  invalidateDocumentQuery = true,
  createAlgoliaRecord,
  generateAlgoliaRecord,
}: {
  collectionName: string;
  onSuccess?: Function;
  invalidateCollectionQuery?: boolean;
  invalidateDocumentQuery?: boolean;
  createAlgoliaRecord?: boolean;
  generateAlgoliaRecord?: (record: any) => any;
}) => {
  const queryClient = useQueryClient();

  const { saveRecordMutation } = useAlgolia({
    index: collectionName,
  });

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
    let data = document;
    const now = Timestamp.fromDate(new Date());
    if (addTimestamp && !document.createdAt) {
      data = { ...document, id: documentId, createdAt: now };
    } else if (addTimestamp) {
      data = { ...document, id: documentId, updatedAt: now };
    }
    await setDoc(docRef, data);
    if (createAlgoliaRecord) {
      let record = data;
      if (typeof generateAlgoliaRecord === "function") {
        record = generateAlgoliaRecord(data);
      }
      await saveRecordMutation.mutateAsync(record);
    }
    return { data, documentId };
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
