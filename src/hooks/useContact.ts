import useFirestoreDocumentQuery from "./useFirestoreDocumentQuery";
import useFirestoreDocumentMutation from "./useFirestoreDocumentMutation";
import { Contact } from "../constants/schemas/contact";

const collectionName = "contact";
const documentId = "contact";
const useContact = () => {
  const contactQuery = useFirestoreDocumentQuery({
    collectionName,
    documentId,
  });
  const contact = contactQuery?.data;

  const { firestoreDocumentMutation: contactMutation } =
    useFirestoreDocumentMutation({
      collectionName: "contact",
      invalidateDocumentQuery: true,
    });

  const update = (contact: Contact) => {
    contactMutation.mutate({ documentId, document: contact });
  };

  return { contact, contactQuery, update, contactMutation };
};

export default useContact;
