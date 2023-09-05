import { useQueryClient, useMutation } from "@tanstack/react-query";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import useAlgolia from "./useAlgolia";

const useFirestoreDocumentDeletion = ({
  collectionName,
  onSuccess = () => null,
  deleteAlgoliaRecord = false,
}: {
  collectionName: string;
  onSuccess?: Function;
  deleteAlgoliaRecord?: boolean;
}) => {
  const { deleteRecordMutation } = useAlgolia({ index: collectionName });
  const queryClient = useQueryClient();

  const deleteFromFirestore = async (documentIds: string[]) => {
    for (let i = 0; i < documentIds.length; i++) {
      const id = documentIds[i];
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    }
    return documentIds;
  };

  const firestoreDocumentDeletion = useMutation({
    mutationKey: ["delete-from-collection", collectionName],
    mutationFn: deleteFromFirestore,
    onSuccess: (documentIds) => {
      onSuccess(documentIds);
      if (deleteAlgoliaRecord) deleteRecordMutation.mutateAsync(documentIds);
      queryClient.invalidateQueries(["collection", collectionName]);
    },
  });

  return { firestoreDocumentDeletion };
};

export default useFirestoreDocumentDeletion;
