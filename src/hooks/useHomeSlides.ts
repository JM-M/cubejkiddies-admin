import { useMemo } from "react";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { useIonRouter } from "@ionic/react";
import { useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import useFirestoreDocumentQuery from "./useFirestoreDocumentQuery";
import useFirestoreCollectionQuery from "./useFirestoreCollectionQuery";
import useFirestoreDocumentMutation from "./useFirestoreDocumentMutation";
import useFirestoreDocumentDeletion from "./useFirestoreDocumentDeletion";
import useProducts from "./useProducts";
import useFirebaseStorage from "./useFirebaseStorage";
import { PhotoFile, base64ToImage } from "./usePhotoGallery";

export interface HomeSlide {
  id?: string;
  image: string;
  button: boolean;
  buttonText?: string;
  buttonHref?: string;
}

interface Props {
  homeSlideId: string;
}

const collectionName = "homeSlides";
const useHomeSlides = (props: Props = { homeSlideId: "" }) => {
  const { homeSlideId } = props;
  const router = useIonRouter();

  const queryClient = useQueryClient();

  const homeSlideQuery = useFirestoreDocumentQuery({
    collectionName,
    documentId: homeSlideId,
  });
  const { data: homeSlide } = homeSlideQuery;
  const { buttonHref = "" } = homeSlide || {};

  const buttonHrefSegments = buttonHref.split("/");
  let buttonLinkType = buttonHrefSegments[1];

  let productId = "";
  if (buttonLinkType === "products") {
    productId = buttonHrefSegments[2];
    buttonLinkType = "product";
  }
  const { productQuery } = useProducts({ productId });
  const product = productQuery.data;

  const formSlide = useMemo(() => {
    if (!homeSlide) return null;
    const { button, buttonText, image } = homeSlide;
    if (button && !buttonLinkType) return null;
    const slide: any = {
      button,
      image,
    };
    if (button) {
      slide.buttonText = buttonText;
      slide.buttonLinkType = buttonLinkType;
      if (buttonLinkType === "product") {
        if (!product) return null;
        slide.product = product;
      } else if (buttonLinkType === "category") {
        slide.category = "/" + buttonHrefSegments.slice(2).join("/");
      }
    }
    return slide;
  }, [homeSlide, product, buttonLinkType]);

  const homeSlidesQuery = useFirestoreCollectionQuery({
    collectionName,
    options: {
      pageSize: 1000,
    },
  });
  const homeSlides = homeSlidesQuery.data;

  const { firestoreDocumentMutation: addHomeSlideMutation } =
    useFirestoreDocumentMutation({
      collectionName,
      onSuccess: () => router.push("/home-slider"),
    });

  const { uploadToFirebaseStorage } = useFirebaseStorage();

  const saveImage = async ({
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

  const addHomeSlide = async ({
    slide,
    onImageUploadProgress,
  }: {
    slide: HomeSlide;
    onImageUploadProgress: (progress: number) => any;
  }) => {
    let image = slide.image as string | PhotoFile;
    if (typeof image !== "string" && image.filepath) {
      const url = await saveImage({
        image,
        onUploadProgress: (progress) => onImageUploadProgress(progress),
      });
      image = url as string;
    }
    addHomeSlideMutation.mutate({
      document: JSON.parse(JSON.stringify({ ...slide, image })),
      documentId: slide.id || uuidv4(),
    });
  };

  const onDeleteSlideSuccess = (documentIds: string[]) => {
    queryClient.setQueriesData(
      ["collection", collectionName],
      (slides: any) => {
        if (Array.isArray(slides) && slides.length) {
          return slides.filter((slide) => !documentIds.includes(slide?.id));
        }
        return slides;
      }
    );
  };

  const { firestoreDocumentDeletion: homeSlideDeletionMutation } =
    useFirestoreDocumentDeletion({
      collectionName,
      onSuccess: onDeleteSlideSuccess,
    });
  const deleteHomeSlide = homeSlideDeletionMutation.mutate;

  return {
    formSlide,
    loadingFormSlide:
      homeSlideId && (homeSlideQuery.isLoading || productQuery.isLoading),
    homeSlides,
    homeSlidesQuery,
    addHomeSlide,
    addHomeSlideMutation,
    deleteHomeSlide,
    homeSlideDeletionMutation,
  };
};

export default useHomeSlides;
