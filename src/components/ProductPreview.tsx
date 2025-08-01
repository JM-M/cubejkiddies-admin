import { useMemo, useState } from "react";
import { IonFab, IonFabButton, IonFabList, IonIcon } from "@ionic/react";
import {
  chevronUpOutline,
  pencilOutline,
  trashBinOutline,
} from "ionicons/icons";
import ProductCarousel from "./ProductCarousel";
import ProductInfo from "./ProductInfo";
import ProductVariations from "./ProductVariations";
import ProductDescription from "./ProductDescription";
import PageLoader from "./PageLoader";
import useProducts from "../hooks/useProducts";

interface Props {
  productId: string;
}

const ProductPreview = ({ productId }: Props) => {
  const [variant, setVariant] = useState<any>({});

  const {
    productQuery: { data, isLoading },
    deleteProduct,
    productDeletionMutation,
  } = useProducts({
    productId,
  });

  const {
    name,
    price,
    discount,
    description,
    stocks = [],
    variations,
  } = data || {};

  const setProductVariant = (key: string, name: string) =>
    setVariant((v: any) => ({ ...v, [key]: name }));

  const variantKeys = Object.keys(variant);
  const images = useMemo(() => {
    return stocks.reduce((images: any[], stock: any) => {
      const { variationCombination } = stock;
      for (let i = 0; i < variantKeys.length; i++) {
        const key = variantKeys[i];
        const value = variant[key];
        if (value !== variationCombination[key]) {
          return images;
        }
      }
      return [...images, ...stock.images];
    }, []);
  }, [stocks, variant, variantKeys]);

  if (isLoading || productDeletionMutation.isLoading) return <PageLoader />;
  if (!data)
    return (
      <div className="h-fit w-fit m-auto text-gray-500 text-center">
        No product data
      </div>
    );

  return (
    <>
      <ProductCarousel images={images} hasVariant={!!variantKeys.length} />
      <ProductInfo name={name} price={price} discount={discount} />
      <ProductVariations
        variations={variations}
        setProductVariant={setProductVariant}
      />
      <ProductDescription content={description} />
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton>
          <IonIcon icon={chevronUpOutline}></IonIcon>
        </IonFabButton>
        <IonFabList side="top">
          <IonFabButton
            color="primary"
            routerLink={`/products/${productId}/edit`}
          >
            <IonIcon icon={pencilOutline}></IonIcon>
          </IonFabButton>
          <IonFabButton
            color="danger"
            onClick={() => deleteProduct([productId])}
          >
            <IonIcon icon={trashBinOutline}></IonIcon>
          </IonFabButton>
        </IonFabList>
      </IonFab>
    </>
  );
};

export default ProductPreview;
