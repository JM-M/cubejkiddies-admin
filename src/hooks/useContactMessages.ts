import { Timestamp } from 'firebase/firestore';
import useCollectionInfiniteQuery from './useCollectionInfiniteQuery';
import { User } from './useUsers';

export interface ContactMessage {
  id: string;
  message: string;
  user: User;
  createdAt?: Timestamp;
}

const collectionName = 'contactMessages';
const useContactMessages = () => {
  const contactMessagesQuery = useCollectionInfiniteQuery({
    collectionName,
    orderByField: 'createdAt',
    pageSize: 10,
  });
  const contactMessages: ContactMessage[] =
    contactMessagesQuery.data?.allDocs || [];

  return { contactMessagesQuery, contactMessages };
};

export default useContactMessages;
