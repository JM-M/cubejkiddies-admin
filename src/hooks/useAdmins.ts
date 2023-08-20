import { useEffect } from "react";
import { useIonRouter } from "@ionic/react";
import useFirestoreCollectionQuery from "./useFirestoreCollectionQuery";
import useFirestoreDocumentQuery from "./useFirestoreDocumentQuery";
import useFirestoreDocumentMutation from "./useFirestoreDocumentMutation";
import { AdminSignUp } from "../constants/schemas/auth";
import useAuth from "./useAuth";

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

const collectionName = "admins";

const useAdmins = (props: Props = {}) => {
  const { uid = "" } = props;

  const ionRouter = useIonRouter();

  const { admin } = useAuth();

  useEffect(() => {
    if (admin?.primary) ionRouter.push("/products");
  }, [admin]);

  const adminsQuery = useFirestoreCollectionQuery({
    collectionName,
    options: { pageSize: 1000 },
  });
  const admins = adminsQuery.data;

  const adminQuery = useFirestoreDocumentQuery({
    collectionName,
    documentId: uid,
  });

  const { firestoreDocumentMutation: createAdminMutation } =
    useFirestoreDocumentMutation({ collectionName });

  const createAdmin = async (admin: AdminSignUp) => {
    console.log(admin);
  };

  return { admins, adminsQuery, adminQuery, createAdmin, createAdminMutation };
};

export default useAdmins;
