import { Timestamp } from "firebase/firestore";
import useFirestoreCollectionQuery from "./useFirestoreCollectionQuery";
import { User } from "./useUsers";

export interface ContactMessage {
  id: string;
  message: string;
  user: User;
  createdAt?: Timestamp;
}

const collectionName = "contactMessages";
const useContactMessages = () => {
  const contactMessagesQuery = useFirestoreCollectionQuery({
    collectionName,
    orderByField: "createdAt",
    options: { pageSize: 10 },
  });
  const contactMessages: ContactMessage[] = contactMessagesQuery.data;
  return { contactMessagesQuery, contactMessages };
};

export default useContactMessages;
