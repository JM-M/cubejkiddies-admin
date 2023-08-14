import { useMemo } from "react";
import { Product } from "../constants/schemas/product";

export const getProductImages = (product: Product) => {
  const { stocks } = product;
  return stocks.reduce((images: any[], stock: any) => {
    return [...images, ...stock.images];
  }, []);
};

const useProductImages = (product: Product) => {
  const images = useMemo(() => {
    return getProductImages(product);
  }, [getProductImages]);

  return images;
};

export default useProductImages;
