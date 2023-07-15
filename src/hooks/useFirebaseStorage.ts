import { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';

const useFirebaseStorage = () => {
  const uploadToFirebaseStorage = async ({
    data,
    metadata,
    path,
    onUploadProgress,
  }: {
    data: any;
    metadata?: any;
    path: string;
    onUploadProgress: (progress: number) => any;
  }) => {
    let promise = new Promise((resolve, reject) => {
      // Create a storage reference from our storage service
      const storageRef = ref(storage, path);

      // save image asynchronously while saving the url and corresponding filepath
      // keeping track of success and failure
      const uploadTask = uploadBytesResumable(storageRef, data, metadata);

      // Register three observers:
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onUploadProgress(progress);
          // switch (snapshot.state) {
          //   case 'paused':
          //     console.log('Upload is paused');
          //     break;
          //   case 'running':
          //     console.log('Upload is running');
          //     break;
          // }
        },
        (error) => {
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
    return promise;
  };

  return { uploadToFirebaseStorage };
};

export default useFirebaseStorage;
