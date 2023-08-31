import { useState, useEffect, useContext } from 'react';
import { useIonRouter } from '@ionic/react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '../../firebase';
import { AdminLogin } from '../constants/schemas/auth';
import useFirestoreDocumentMutation from './useFirestoreDocumentMutation';
import useFirestoreDocumentQuery from './useFirestoreDocumentQuery';
import AutoAuthenticatingContext from '../contexts/autoAuthenticating';

export interface AdminFirestoreDocument {
  email: string;
  firstName: string;
  lastName: string;
  uid: string;
  createdAt?: Timestamp;
  primary?: boolean;
}

const collectionName = 'admins';
const useAuth = () => {
  const [firebaseAuthAdmin, setFirebaseAuthAdmin] =
    useState<FirebaseUser | null>(auth.currentUser);
  const [autoAuthenticating, setAutoAuthenticating] = useContext(
    AutoAuthenticatingContext
  );
  const { uid } = firebaseAuthAdmin || {};

  const ionRouter = useIonRouter();

  const queryClient = useQueryClient();

  useEffect(() => {
    onAuthStateChanged(auth, (admin) => {
      setFirebaseAuthAdmin(admin);
    });
  }, []);

  const { firestoreDocumentMutation: adminDocMutation } =
    useFirestoreDocumentMutation({
      collectionName,
      invalidateCollectionQuery: false,
      invalidateDocumentQuery: false,
    });

  const onAdminDocFetch = (adminDoc: AdminFirestoreDocument) => {
    const uid = adminDoc?.uid;
    if (!uid) {
      if (firebaseAuthAdmin) {
        setFirebaseAuthAdmin(null);
        signOut(auth);
      }
      return;
    }
    setAutoAuthenticating(false);
    const authEmail = firebaseAuthAdmin?.email;
    const adminDocEmail = adminDoc.email;
    if (adminDocEmail !== authEmail) {
      adminDocMutation.mutateAsync({
        document: { ...adminDoc, email: authEmail },
        documentId: uid,
        addTimestamp: true,
      });
    }
  };

  const { data: admin } = useFirestoreDocumentQuery({
    collectionName,
    documentId: uid,
    onSuccess: onAdminDocFetch,
  });
  const isLoggedIn = !autoAuthenticating && !!uid;

  useEffect(() => {
    const pathname = ionRouter?.routeInfo.pathname;
    if (!isLoggedIn && pathname !== '/login')
      ionRouter.push(`/login?returnUrl=${pathname}`);
  }, [isLoggedIn, ionRouter]);

  // using an effect ensures that autoAuthenticating is only turned to false when admin state has been set
  useEffect(() => {
    if (admin && autoAuthenticating) {
      setAutoAuthenticating(false);
      ionRouter.push('/products');
    }
  }, [admin, autoAuthenticating, ionRouter]);

  const loginFn = async ({ email, password }: AdminLogin) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginMutation = useMutation({
    mutationKey: ['admin-sign-in'],
    mutationFn: loginFn,
    onSuccess: () => {
      let destination = '/products';
      const params: string = ionRouter.routeInfo.search.split('?')[1];
      const searchParams = new URLSearchParams(params);
      const returnUrl = searchParams.get('returnUrl');
      if (returnUrl) destination = returnUrl;
      ionRouter.push(destination);
    },
  });

  const onLogOut = () => {
    queryClient.setQueryData(
      ['document', { collectionName, documentId: uid }],
      null,
      undefined
    );
    setFirebaseAuthAdmin(null);
  };

  const logOutFn = async () => {
    signOut(auth);
  };

  const logOutMutation = useMutation({
    mutationKey: ['admin-log-out'],
    mutationFn: logOutFn,
    onSuccess: onLogOut,
  });

  const logout = logOutMutation.mutate;

  return {
    login: loginMutation.mutate,
    loginMutation,
    logout,
    logOutMutation,
    admin: uid ? (admin as AdminFirestoreDocument) : undefined,
    uid,
    isLoggedIn,
  };
};

export default useAuth;
