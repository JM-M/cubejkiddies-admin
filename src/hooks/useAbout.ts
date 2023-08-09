import useFirestoreDocumentQuery from "./useFirestoreDocumentQuery";
import useFirestoreDocumentMutation from "./useFirestoreDocumentMutation";
import { About } from "../constants/schemas/about";

const collectionName = "about";
const documentId = "about";
const useAbout = () => {
  const aboutQuery = useFirestoreDocumentQuery({
    collectionName,
    documentId,
  });
  const about = aboutQuery?.data;

  const { firestoreDocumentMutation: aboutMutation } =
    useFirestoreDocumentMutation({
      collectionName: "about",
      invalidateDocumentQuery: true,
    });

  const update = (about: About) => {
    aboutMutation.mutate({ documentId, document: about });
  };

  return { about, aboutQuery, update, aboutMutation };
};

export default useAbout;
