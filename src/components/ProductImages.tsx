import { useEffect, useRef, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonModal,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonFab,
  IonFabButton,
  IonActionSheet,
} from "@ionic/react";
import { closeOutline, camera, trash, close } from "ionicons/icons";

import { usePhotoGallery, PhotoFile } from "../hooks/usePhotoGallery";
import { PRODUCT_PHOTOS } from "../constants/storageKeys";

type ImageType = PhotoFile | string;

interface ProductImagesProps {
  onChange: Function;
  index: number;
  images: ImageType[];
  setValue: Function;
}

const ProductImages = ({
  onChange,
  index,
  images = [],
  setValue,
}: ProductImagesProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [photoToDelete, setPhotoToDelete] = useState<ImageType>();

  const { deletePhoto, photos, takePhoto, clearStorage } = usePhotoGallery({
    storageKey: PRODUCT_PHOTOS,
  });

  const initialImagesRef = useRef(images);

  useEffect(() => {
    // delete all photos when component unmounts
    return () => {
      (async () => {
        clearStorage();
      })();
    };
  }, [clearStorage]);

  useEffect(() => {
    onChange([...photos, ...initialImagesRef.current]);
  }, [photos]);

  const closeModal = () => setShowModal(false);

  const openModal = () => setShowModal(true);

  const getImgSrc = (image: PhotoFile | string) =>
    typeof image === "string" ? image : image.webviewPath;

  const isPhotoFile = (image: ImageType) => {
    return typeof image !== "string" && image?.filepath;
  };

  const allImages = [...photos, ...initialImagesRef.current];
  const firstImage = allImages[0];
  const numPhotos = allImages.length;

  return (
    <>
      <IonModal isOpen={showModal}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={closeModal}>
                <IonIcon icon={closeOutline} className="h-[24px] w-[24px]" />
              </IonButton>
            </IonButtons>
            <IonTitle>Images (stock {index + 1})</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent color="light" class="ion-padding">
          <IonGrid>
            <IonRow>
              {allImages.map((image, index) => {
                return (
                  <IonCol size="6" key={index}>
                    <IonImg
                      onClick={() => setPhotoToDelete(image)}
                      src={getImgSrc(image)}
                    />
                  </IonCol>
                );
              })}
            </IonRow>
          </IonGrid>
          <IonFab vertical="bottom" horizontal="center" slot="fixed">
            <IonFabButton onClick={() => takePhoto()}>
              <IonIcon icon={camera}></IonIcon>
            </IonFabButton>
          </IonFab>
          <IonActionSheet
            isOpen={!!photoToDelete}
            buttons={[
              {
                text: "Delete",
                role: "destructive",
                icon: trash,
                handler: () => {
                  if (photoToDelete) {
                    if (isPhotoFile(photoToDelete)) {
                      deletePhoto(photoToDelete as PhotoFile);
                    } else {
                      const newImages = images.filter(
                        (v) => isPhotoFile(v) || v !== photoToDelete
                      );
                      setValue(`stocks.${index}.images`, newImages);
                      initialImagesRef.current = newImages;
                    }
                    setPhotoToDelete(undefined);
                  }
                },
              },
              {
                text: "Cancel",
                icon: close,
                role: "cancel",
              },
            ]}
            onDidDismiss={() => setPhotoToDelete(undefined)}
          />
        </IonContent>
      </IonModal>
      <div
        className="flex flex-col items-center justify-center w-[150px] h-[200px] rounded-xl"
        onClick={openModal}
      >
        {!!numPhotos ? (
          <IonImg src={getImgSrc(firstImage)} />
        ) : (
          <span className="inline-block my-3 text-[var(--ion-color-medium)]">
            No images added
          </span>
        )}
        {numPhotos > 1 && (
          <span className="inline-block my-3">{numPhotos} images</span>
        )}
        <IonButton fill="clear" className="block mt-5">
          Edit
        </IonButton>
      </div>
    </>
  );
};

export default ProductImages;
