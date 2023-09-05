import { useState, useEffect, useCallback } from "react";
import { isPlatform } from "@ionic/react";

import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";

const DEFAULT_STORAGE_KEY = "photos";

interface Props {
  storageKey: string;
}

export function usePhotoGallery({ storageKey = DEFAULT_STORAGE_KEY }: Props) {
  const [photos, setPhotos] = useState<PhotoFile[]>([]);

  const clearStorage = useCallback(async () => {
    await Preferences.remove({ key: storageKey });
    setPhotos([]);
  }, [storageKey]);

  useEffect(() => {
    clearStorage();
  }, []);

  useEffect(() => {
    const loadSaved = async () => {
      const { value } = await Preferences.get({ key: storageKey });

      const photosInPreferences = (
        value ? JSON.parse(value) : []
      ) as PhotoFile[];
      // If running on the web...
      if (!isPlatform("hybrid")) {
        for (let photo of photosInPreferences) {
          const file = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data,
          });
          // Web platform only: Load the photo as base64 data
          photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
        }
      }
      setPhotos(photosInPreferences);
    };
    loadSaved();
  }, []);

  const capturePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
    const fileName = new Date().getTime() + ".jpeg";
    const savedFileImage = await savePicture(photo, fileName);
    return savedFileImage;
  };

  const takePhoto = async () => {
    const savedFileImage = await capturePhoto();
    const newPhotos = [savedFileImage, ...photos];
    setPhotos(newPhotos);
    Preferences.set({ key: storageKey, value: JSON.stringify(newPhotos) });
  };

  const replacePhoto = async (index: number) => {
    if (!index && isNaN(index)) {
      throw new Error("No index provided");
    }
    if (index > photos?.length - 1) {
      throw new Error(`No image to be replaced at index ${index}`);
    }
    const savedFileImage = await capturePhoto();
    const newPhotos = photos.map((photo, i: number) => {
      if (i === index) return savedFileImage;
      return photo;
    });
    setPhotos(newPhotos);
    Preferences.set({ key: storageKey, value: JSON.stringify(newPhotos) });
  };

  const savePicture = async (
    photo: Photo,
    fileName: string
  ): Promise<PhotoFile> => {
    let base64Data: string;
    // "hybrid" will detect Cordova or Capacitor;
    if (isPlatform("hybrid")) {
      const file = await Filesystem.readFile({
        path: photo.path!,
      });
      base64Data = file.data as string;
    } else {
      base64Data = await base64FromPath(photo.webPath!);
    }
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    if (isPlatform("hybrid")) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
      };
    }
  };

  const deletePhoto = async (photo: PhotoFile) => {
    // Remove this photo from the Photos reference data array
    const newPhotos = photos.filter((p) => p.filepath !== photo.filepath);

    // Update photos array cache by overwriting the existing photo array
    Preferences.set({ key: storageKey, value: JSON.stringify(newPhotos) });

    // delete photo file from filesystem
    const filename = photo.filepath.substring(
      photo.filepath.lastIndexOf("/") + 1
    );
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    });
    setPhotos(newPhotos);
  };

  return {
    deletePhoto,
    photos,
    takePhoto,
    replacePhoto,
    clearStorage,
  };
}

export interface PhotoFile {
  filepath: string;
  webviewPath?: string;
}

export async function base64FromPath(path: string): Promise<string> {
  const response = await fetch(path);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject("method did not return a string");
      }
    };
    reader.readAsDataURL(blob);
  });
}

export const base64ToImage = (base64String: string) => {
  const dataURI = `data:image/jpeg;base64,${base64String}`;
  const fileDate = dataURI.split(",");
  // const mime = fileDate[0].match(/:(.*?);/)[1];
  const byteString = atob(fileDate[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const int8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([arrayBuffer], { type: "image/jpeg" });
  return blob;
};
