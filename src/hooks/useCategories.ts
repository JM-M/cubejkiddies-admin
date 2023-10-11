import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from 'firebase/firestore';
import useFirestoreDocumentMutation from './useFirestoreDocumentMutation';
import useFirestoreDocumentDeletion from './useFirestoreDocumentDeletion';
import useFirestoreCollectionQuery from './useFirestoreCollectionQuery';

export interface Category {
  id?: string;
  value: string;
  name: string;
  parent: string | null;
  createdAt?: Timestamp;
}

interface Props {
  onSaveCategorySuccess?: Function;
  onDeleteDocumentSuccess?: Function;
}

const useCategories = (props: Props | undefined = {}) => {
  const {
    onSaveCategorySuccess = () => null,
    onDeleteDocumentSuccess = () => null,
  } = props;

  const { firestoreDocumentMutation } = useFirestoreDocumentMutation({
    collectionName: 'categories',
    onSuccess: onSaveCategorySuccess,
  });

  const { firestoreDocumentDeletion } = useFirestoreDocumentDeletion({
    collectionName: 'categories',
    onSuccess: onDeleteDocumentSuccess,
  });

  const categoriesQuery = useFirestoreCollectionQuery({
    collectionName: 'categories',
    orderByField: 'createdAt',
    options: {
      pageSize: 1000,
    },
  });

  const saveCategory = ({ id, ...category }: Category) => {
    const documentId = id || uuidv4();
    // save product
    firestoreDocumentMutation.mutate({
      document: category,
      documentId,
      addTimestamp: true,
    });
    return documentId;
  };

  const deleteCategory = async ({ value, id }: Category) => {
    const childCategories = getChildCategories(value);
    const categoryToBeDeletedIds = [
      id,
      ...childCategories.map((c: Category) => c.id).filter((v: string) => v),
    ];
    firestoreDocumentDeletion.mutate(categoryToBeDeletedIds);
  };

  const getChildCategories = (value: string) => {
    if (!categoriesQuery.data?.docs?.length) return [];
    return categoriesQuery.data.docs.filter((category: Category) => {
      const { parent } = category;
      return parent === value;
    });
  };

  const createCategoryValueFromName = ({
    name,
    parent,
  }: {
    name: string;
    parent: string;
  }) =>
    `${parent === '/' ? '' : parent}/${name
      .replaceAll(' ', '-')
      .toLowerCase()}`;

  const getCategoryFromValue = (value: string) =>
    categoriesQuery.data?.docs?.find((c: Category) => c.value === value);

  const getCategoryNameFromValue = (value: string) =>
    getCategoryFromValue(value)?.name;

  const getCategoryFromId = (id: string) =>
    categoriesQuery.data?.docs?.find((c: Category) => c.id === id);

  return {
    categoriesQuery,
    saveCategory,
    saveMutation: firestoreDocumentMutation,
    deleteCategory,
    deletionMutation: firestoreDocumentDeletion,
    getChildCategories,
    createCategoryValueFromName,
    getCategoryFromValue,
    getCategoryNameFromValue,
    getCategoryFromId,
  };
};

export default useCategories;
