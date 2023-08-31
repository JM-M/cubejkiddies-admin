import { useIonRouter } from '@ionic/react';
import { v4 as uuidv4 } from 'uuid';
import useFirestoreDocumentMutation from './useFirestoreDocumentMutation';
import useFirestoreCollectionQuery from './useFirestoreCollectionQuery';
import useFirestoreDocumentQuery from './useFirestoreDocumentQuery';
import { ProductSection } from '../constants/schemas/productSection';
import useFirestoreDocumentDeletion from './useFirestoreDocumentDeletion';

export interface DatabaseProductSection
  extends Omit<ProductSection, 'products'> {}

interface Props {
  productSectionId?: string;
  onMutationSuccess?: Function;
}

const collectionName = 'productSections';

const useProductSections = (props: Props | undefined = {}) => {
  const { productSectionId, onMutationSuccess = () => null } = props;

  const ionRouter = useIonRouter();

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

  const { firestoreDocumentMutation: sectionProductMutation } =
    useFirestoreDocumentMutation({
      collectionName: `productSections/${productSectionId}/products`,
    });

  const saveProductSection = async (productSection: ProductSection) => {
    const { products = [], ...rest } = productSection;
    const documentId = productSection.id || uuidv4();
    const document: DatabaseProductSection = {
      ...rest,
    };
    for (const product of products) {
      const { id: productId } = product;
      await sectionProductMutation.mutateAsync({
        document: { id: productId },
        documentId: productId!,
      });
    }
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

  const { firestoreDocumentDeletion: productSectionDeletionMutation } =
    useFirestoreDocumentDeletion({
      collectionName,
      onSuccess: () => ionRouter.push('/home-product-sections'),
    });

  const deleteProductSection = () => {
    if (!productSectionId) return;
    productSectionDeletionMutation.mutate([productSectionId!]);
  };

  return {
    saveProductSection,
    productSectionMutation: firestoreDocumentMutation,
    productSectionQuery,
    productSectionsQuery,
    deleteProductSection,
    productSectionDeletionMutation,
  };
};

export default useProductSections;
