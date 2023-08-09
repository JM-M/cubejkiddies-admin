import { useEffect } from "react";
import { IonIcon, IonImg } from "@ionic/react";
import { camera } from "ionicons/icons";
import { Controller } from "react-hook-form";
import Button from "./Button";
import ErrorText from "./ErrorText";
import { usePhotoGallery, PhotoFile } from "../hooks/usePhotoGallery";
import { NEW_HOME_SLIDE } from "../constants/storageKeys";

interface Props {
  control: any;
  name: string;
  aspectRatio: number;
  setValue: Function;
  value?: PhotoFile | string;
  error?: string;
}

const ImageUpload: React.FC<Props> = ({
  control,
  name,
  aspectRatio,
  setValue = () => null,
  error,
}) => {
  const { photos, takePhoto, replacePhoto } = usePhotoGallery({
    storageKey: NEW_HOME_SLIDE,
  });
  const photo = photos?.length && photos[0];

  useEffect(() => {
    if (!photo) return;
    setValue(photo);
  }, [photos, setValue]);

  const chooseImage = async () => {
    if (!photos?.length) {
      await takePhoto();
      return;
    }
    await replacePhoto(0);
  };

  const getImgSrc = (image: PhotoFile | string) =>
    typeof image === "string" ? image : image.webviewPath;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const { value } = field;
        let src: string | undefined = "";
        if (photo) {
          src = getImgSrc(photo);
        } else if (value && typeof value === "string") {
          src = value;
        }
        return (
          <div className="mb-5">
            <div
              style={{ aspectRatio }}
              className="flex justify-center items-center bg-gray-50 border border-gray-500 border-dashed rounded-xl overflow-hidden"
            >
              {src ? (
                <IonImg src={src} alt={name} />
              ) : (
                <Button onClick={chooseImage}>
                  <IonIcon icon={camera} className="inline-block mr-2" />
                  Choose image
                </Button>
              )}
            </div>
            {!!src && (
              <Button
                fill="outline"
                className="block w-fit mt-2 ml-auto"
                onClick={chooseImage}
              >
                <IonIcon icon={camera} className="inline-block mr-2" />
                Change image
              </Button>
            )}
            <ErrorText text={error} />
          </div>
        );
      }}
    />
  );
};

export default ImageUpload;
