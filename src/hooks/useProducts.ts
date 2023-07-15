import { Filesystem, Directory } from '@capacitor/filesystem';
import { v4 as uuidv4 } from 'uuid';

import { Product } from '../constants/schemas/product';
import { PhotoFile, base64ToImage } from './usePhotoGallery';
import useFirebaseStorage from './useFirebaseStorage';
import useFirestoreDocumentMutation from './useFirestoreDocumentMutation';
import useFirestoreCollectionQuery from './useFirestoreCollectionQuery';
import useFirestoreDocumentQuery from './useFirestoreDocumentQuery';

export interface SortOption {
  field: string;
  reverse?: boolean;
}

interface Props {
  productId?: string;
  sortBy?: SortOption;
}

const collectionName = 'products';

const useProducts = (props: Props = {}) => {
  const { productId, sortBy = { field: 'name', reverse: false } } = props;

  const { uploadToFirebaseStorage } = useFirebaseStorage();
  const { firestoreDocumentMutation } = useFirestoreDocumentMutation({
    collectionName,
  });

  const productsQuery = useFirestoreCollectionQuery({
    collectionName,
    orderByField: sortBy.field,
    reverseOrder: sortBy.reverse,
    options: {
      pageSize: 10,
    },
  });

  const saveProductImage = async ({
    image,
    onUploadProgress,
  }: {
    image: PhotoFile;
    onUploadProgress: (progress: number) => any;
  }) => {
    // get image
    const file = await Filesystem.readFile({
      path: image.filepath,
      directory: Directory.Data,
    });
    const blob = base64ToImage(file.data);
    const url = await uploadToFirebaseStorage({
      data: blob,
      path: `images/products/${uuidv4()}`,
      onUploadProgress,
    });
    return url;
  };

  const uploadStockImages = async ({
    stocks,
    onImageUploadProgress,
  }: {
    stocks: any[];
    onImageUploadProgress: (progress: {
      index: number;
      progress: number;
      total: number;
    }) => any;
  }) => {
    // Uploads any unsaved images in each stock and replaces it with the url

    const savedImages: any = {}; // { filepath: url }
    const unsavedImages = [];

    // for each stock
    // check if unsaved images are present and if true,
    // save the image
    for (const stock of stocks) {
      const { images = [] } = stock;
      if (images.length) {
        for (const image of images) {
          if (typeof image !== 'string' && image.filepath) {
            unsavedImages.push(image);
          }
        }
      }
    }

    for (let index = 0; index < unsavedImages.length; index++) {
      const image = unsavedImages[index];
      const url = await saveProductImage({
        image,
        onUploadProgress: (progress) =>
          onImageUploadProgress({
            index,
            progress,
            total: unsavedImages.length,
          }),
      });
      if (url) savedImages[image.filepath] = url;
    }

    // replace image files with url
    return stocks.map((stock) => {
      const { images = [] } = stock;
      if (!images.length) return stock;
      return {
        ...stock,
        images: images
          .map((image: any) => {
            if (typeof image === 'string') return image;
            if (image.filepath) {
              if (savedImages[image.filepath]) {
                return savedImages[image.filepath];
              }
              throw new Error('Unuploaded image found after image upload!');
            }
            throw new Error(
              'Invalid image found in stocks! Image is neither a string nor has the filepath property.'
            );
          })
          .filter((v: string) => v),
      };
    });
  };

  const saveProduct = async ({
    product,
    productId,
    onImageUploadProgress = () => null,
  }: {
    product: Product;
    productId?: string;
    onImageUploadProgress: (progress: {
      index: number;
      progress: number;
      total: number;
    }) => any;
  }) => {
    const { stocks = [] } = product;
    if (stocks?.length)
      product.stocks = await uploadStockImages({
        stocks,
        onImageUploadProgress,
      });

    const documentId = productId || uuidv4();
    // save product
    firestoreDocumentMutation.mutate({
      document: product,
      documentId,
      addTimestamp: true,
    });
    return documentId;
  };

  const productQuery = useFirestoreDocumentQuery({
    collectionName,
    documentId: productId,
  });

  return {
    saveProduct,
    productsQuery,
    productQuery,
    productMutation: firestoreDocumentMutation,
  };
};

export default useProducts;
