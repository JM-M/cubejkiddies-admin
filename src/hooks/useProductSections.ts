import { useMemo } from 'react';
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
  const { onMutationSuccess = () => null } = props;

  const productSectionId = useMemo(() => {
    const { productSectionId } = props;
    if (!productSectionId) return uuidv4();
    return productSectionId;
  }, [props.productSectionId]);

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
      generateAlgoliaRecord: true,
    });

  const saveProductSection = async (productSection: ProductSection) => {
    const { products = [], ...rest } = productSection;
    const documentId = productSectionId;
    const document: DatabaseProductSection = {
      ...rest,
    };
    for (const product of products) {
      const { id: productId, createdAt } = product;
      await sectionProductMutation.mutateAsync({
        document: { id: productId, createdAt },
        documentId: productId!,
      });
    }
    firestoreDocumentMutation.mutateAsync({
      document,
      documentId,
      addTimestamp: true,
    });
  };

  const productSectionQuery = useFirestoreDocumentQuery({
    collectionName,
    documentId: props.productSectionId,
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
    sectionProductMutation,
    productSectionQuery,
    productSectionsQuery,
    deleteProductSection,
    productSectionDeletionMutation,
  };
};

export default useProductSections;
