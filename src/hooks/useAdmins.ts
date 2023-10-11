import { useEffect } from 'react';
import { useIonRouter } from '@ionic/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useFirestoreCollectionQuery from './useFirestoreCollectionQuery';
import useFirestoreDocumentQuery from './useFirestoreDocumentQuery';
import useFirestoreDocumentMutation from './useFirestoreDocumentMutation';
import { AdminSignUp } from '../constants/schemas/auth';
import useAuth from './useAuth';
import useFirestoreDocumentDeletion from './useFirestoreDocumentDeletion';
import { AdminFirestoreDocument } from './useAuth';

export type Admin = {
  email: string;
  firstName: string;
  lastName: string;
  createdAt: any;
  uid?: string;
  primary?: boolean;
};

interface Props {
  uid?: string;
}

const collectionName = 'admins';

const useAdmins = (props: Props = {}) => {
  const { uid = '' } = props;

  const ionRouter = useIonRouter();

  const queryClient = useQueryClient();

  const { admin } = useAuth();
  useEffect(() => {
    if (!admin?.primary) ionRouter.push('/products');
  }, [admin]);

  const adminsQuery = useFirestoreCollectionQuery({
    collectionName,
    options: { pageSize: 1000 },
  });
  const admins = adminsQuery.data?.docs;

  const adminQuery = useFirestoreDocumentQuery({
    collectionName,
    documentId: uid,
  });

  // const { firestoreDocumentMutation: adminDocMutation } =
  //   useFirestoreDocumentMutation({
  //     collectionName,
  //     invalidateCollectionQuery: true,
  //     invalidateDocumentQuery: true,
  //   });

  const createAdminFn = async (adminData: AdminSignUp) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/create-admin`,
      adminData
    );
    return data;
  };

  const onCreateAdmin = () => {
    queryClient.invalidateQueries(['collection', collectionName]);
    ionRouter.push('/admins');
  };

  const createAdminMutation = useMutation({
    mutationKey: ['create-admin-doc'],
    mutationFn: createAdminFn,
    onSuccess: onCreateAdmin, // set adminDoc query
  });

  const createAdmin = createAdminMutation.mutate;

  const { firestoreDocumentDeletion: adminDeletionMutation } =
    useFirestoreDocumentDeletion({
      collectionName,
      onSuccess: () => ionRouter.push('/admins'),
    });

  const deleteAdmin = () => adminDeletionMutation.mutate([uid]);

  return {
    admins,
    adminsQuery,
    adminQuery,
    createAdmin,
    createAdminMutation,
    deleteAdmin,
    adminDeletionMutation,
  };
};

export default useAdmins;
