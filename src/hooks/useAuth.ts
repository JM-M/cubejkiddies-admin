import { useState, useEffect } from "react";
import { useIonRouter } from "@ionic/react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User as FirebaseUser,
  updatePassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auth } from "../../firebase";
import { AdminLogin, AdminSignUp } from "../constants/schemas/auth";
import useFirestoreDocumentMutation from "./useFirestoreDocumentMutation";
import useFirestoreDocumentQuery from "./useFirestoreDocumentQuery";

export interface AdminFirestoreDocument {
  email: string;
  firstName: string;
  lastName: string;
  uid: string;
  createdAt?: Timestamp;
  primary?: boolean;
}

const collectionName = "admins";
const useAuth = () => {
  const [firebaseAuthAdmin, setFirebaseAuthAdmin] =
    useState<FirebaseUser | null>();
  const [autoAuthenticating, setAutoAuthenticating] = useState<boolean>(true);
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

  const saveCreatedAdminToFirestore = (adminDoc: AdminFirestoreDocument) => {
    const { uid } = adminDoc;
    return adminDocMutation.mutateAsync({
      document: adminDoc,
      documentId: uid,
      addTimestamp: true,
    });
  };

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
    if (!isLoggedIn && ionRouter?.routeInfo.pathname !== "/login")
      ionRouter.push("/login");
  }, [isLoggedIn, ionRouter]);

  // using an effect ensures that autoAuthenticating is only turned to false when admin state has been set
  useEffect(() => {
    if (admin && autoAuthenticating) {
      setAutoAuthenticating(false);
      ionRouter.push("/products");
    }
  }, [admin, autoAuthenticating, ionRouter]);

  const createAdminFn = async ({
    email,
    password,
    firstName,
    lastName,
  }: AdminSignUp) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = credential.user.uid;
    const { data: adminDoc } = await saveCreatedAdminToFirestore({
      uid,
      email: credential.user.email as string,
      firstName,
      lastName,
    });
    return adminDoc;
  };

  const onCreateAdmin = (admin: AdminFirestoreDocument) => {
    ionRouter.push("/admins");
  };

  const createAdminMutation = useMutation({
    mutationKey: ["create-admin-doc"],
    mutationFn: createAdminFn,
    onSuccess: onCreateAdmin, // set adminDoc query
  });

  const createAdmin = createAdminMutation.mutate;

  const loginFn = async ({ email, password }: AdminLogin) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginMutation = useMutation({
    mutationKey: ["admin-sign-in"],
    mutationFn: loginFn,
    onSuccess: () => ionRouter.push("/products"),
  });

  const onLogOut = () => {
    queryClient.setQueryData(
      ["document", { collectionName, documentId: uid }],
      null,
      undefined
    );
    setFirebaseAuthAdmin(null);
  };

  const logOutFn = async () => {
    signOut(auth);
  };

  const logOutMutation = useMutation({
    mutationKey: ["admin-log-out"],
    mutationFn: logOutFn,
    onSuccess: onLogOut,
  });

  const logout = logOutMutation.mutate;

  return {
    createAdmin,
    createAdminMutation,
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
