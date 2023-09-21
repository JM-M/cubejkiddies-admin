import { useQueryClient, useMutation } from '@tanstack/react-query';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import useAlgolia from './useAlgolia';

interface Props {
  collectionName: string;
  onSuccess?: Function;
  invalidateCollectionQuery?: boolean;
  invalidateDocumentQuery?: boolean;
  generateAlgoliaRecord?: ((record: any) => any) | boolean;
  generateAlgoliaIndexSettings?:
    | ((arg: { existingSettings: any; record: any }) => any)
    | undefined;
}

const useFirestoreDocumentMutation = ({
  collectionName,
  onSuccess = () => null,
  invalidateCollectionQuery = true,
  invalidateDocumentQuery = true,
  generateAlgoliaRecord,
  generateAlgoliaIndexSettings,
}: Props) => {
  const queryClient = useQueryClient();

  const { saveRecordMutation, getSettingsMutation, setSettingsMutation } =
    useAlgolia({
      index: collectionName,
    });

  const updateAlgoliaIndexSettings = async (record: any) => {
    if (!generateAlgoliaIndexSettings) return;
    const existingSettings = await getSettingsMutation.mutateAsync();
    const settings = generateAlgoliaIndexSettings({
      existingSettings,
      record,
    });
    await setSettingsMutation.mutateAsync(settings);
  };

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

    if (generateAlgoliaRecord) {
      let record = { ...data, objectID: data.id };
      if (typeof generateAlgoliaRecord === 'function') {
        record = generateAlgoliaRecord(data);
      }
      await saveRecordMutation.mutateAsync(record);

      if (generateAlgoliaIndexSettings) {
        updateAlgoliaIndexSettings(record);
      }
    }
    return { data, documentId };
  };

  const firestoreDocumentMutation = useMutation({
    mutationKey: ['upload-to-collection', collectionName],
    mutationFn: uploadToFirestore,
    onSuccess: ({ data, documentId }) => {
      onSuccess(data);
      if (invalidateCollectionQuery) {
        queryClient.invalidateQueries(['collection', collectionName]);
      }
      if (invalidateDocumentQuery) {
        queryClient.invalidateQueries([
          'document',
          { collectionName, documentId },
        ]);
      }
    },
  });

  return { firestoreDocumentMutation };
};

export default useFirestoreDocumentMutation;
