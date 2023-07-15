import { v4 as uuidv4 } from 'uuid';
import useFirestoreDocumentMutation from './useFirestoreDocumentMutation';
import useFirestoreCollectionQuery from './useFirestoreCollectionQuery';
import useFirestoreDocumentQuery from './useFirestoreDocumentQuery';
import { ProductSection } from '../constants/schemas/productSection';

export interface DatabaseProductSection
  extends Omit<ProductSection, 'products'> {
  products: string[];
}

interface Props {
  productSectionId?: string;
  onMutationSuccess?: Function;
}

const collectionName = 'productSections';

const useProductSections = (props: Props | undefined = {}) => {
  const { productSectionId, onMutationSuccess = () => null } = props;

  const productSectionsQuery = useFirestoreCollectionQuery({
    collectionName,
    orderByField: 'title',
    reverseOrder: false,
    options: {
      pageSize: 100,
    },
  });

  const { firestoreDocumentMutation } = useFirestoreDocumentMutation({
    collectionName,
    onSuccess: onMutationSuccess,
  });

  const saveProductSection = async (productSection: ProductSection) => {
    const { products } = productSection;
    const documentId = productSection.id || uuidv4();
    const productIds = products?.map((p) => p.id).filter((v) => !!v) || [];
    const document: DatabaseProductSection = {
      ...productSection,
      products: productIds as string[],
    };
    firestoreDocumentMutation.mutate({
      document,
      documentId,
      addTimestamp: true,
    });
  };

  const productSectionQuery = useFirestoreDocumentQuery({
    collectionName,
    documentId: productSectionId,
  });

  return {
    saveProductSection,
    productSectionMutation: firestoreDocumentMutation,
    productSectionQuery,
    productSectionsQuery,
  };
};

export default useProductSections;
