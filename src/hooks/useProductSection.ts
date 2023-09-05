import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import useFirestoreCollectionQuery from "./useFirestoreCollectionQuery";
import { DatabaseProductSection } from "./useProductSections";
// import useProducts from './useProducts';

const useProductSection = (
  section: DatabaseProductSection | undefined = {} as DatabaseProductSection
) => {
  const {
    // category,
    id,
  } = section || {};
  const pageSize = 10;
  const collectionName = `productSections/${id}/products`;

  const fetchProducts = async (productIds: { id: string }[]) => {
    if (!id) return [];
    const products = [];
    for (const { id: productId } of productIds) {
      const docRef = doc(db, "products", productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const product = { ...docSnap.data(), id: productId } as any;
        products.push(product);
      }
    }
    return products;
  };
  const productsQuery = useFirestoreCollectionQuery({
    collectionName,
    options: {
      pageSize,
    },
    transformDocuments: fetchProducts,
  });

  // const { productsQuery: categoryProductsQuery } = useProducts({ category });

  return {
    productsQuery,
    // productsQuery: category ? categoryProductsQuery : productsQuery,
  };
};

export default useProductSection;
