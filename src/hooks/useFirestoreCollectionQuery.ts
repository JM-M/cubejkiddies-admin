import { useState, useRef, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  startAfter,
  endBefore,
  limit,
  limitToLast,
  getDocs,
  getCountFromServer,
  where,
  documentId,
} from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import { db } from '../../firebase';

interface FirestoreInfiniteQuery {
  collectionName: string;
  match?: object;
  orderByField?: string;
  reverseOrder?: boolean;
  options: {
    pageSize: number;
  };
  ids?: string[];
  transformDocuments?: (docs: any[]) => Promise<any[]>;
}

const useFirestoreCollectionQuery = ({
  collectionName,
  orderByField,
  match,
  reverseOrder = false,
  options: { pageSize },
  ids = [],
  transformDocuments,
}: FirestoreInfiniteQuery) => {
  const [pageNum, setPageNum] = useState<number>(1);

  const hasCountedDocuments = useRef<boolean>(false);

  const lastPageRef = useRef<any>();
  const lastPage = lastPageRef.current;
  const lastPageNumRef = useRef<number>(1);
  const lastPageNum = lastPageNumRef.current;

  const getPrevCursor = () => {
    if (!lastPage?.docs?.length || !orderByField) return undefined;
    const firstDocument = lastPage.docs[0];
    return firstDocument[orderByField];
  };

  const getNextCursor = () => {
    if (!lastPage || !orderByField) return undefined;
    const lastPageDocs = lastPage.docs;
    const lastDocument = lastPageDocs[lastPageDocs.length - 1];
    return lastDocument[orderByField];
  };

  const fetchPage: (arg: any) => any = async ({ queryKey = {} }: any) => {
    const [_key] = queryKey;
    const collectionRef = collection(db, collectionName);
    let queries: any[] = orderByField
      ? [orderBy(orderByField, reverseOrder ? 'asc' : 'desc')]
      : [];
    if (match) {
      Object.entries(match).forEach(([key, value]) => {
        if (value) queries.unshift(where(key, '==', value));
      });
    }
    if (ids.length) queries = [where(documentId(), 'in', ids)];
    let prevCursor, nextCursor;
    if (pageNum > lastPageNum) {
      nextCursor = getNextCursor();
      // get next page
      queries = [...queries, startAfter(nextCursor), limit(pageSize)];
    } else if (pageNum < lastPageNum) {
      prevCursor = getPrevCursor();
      // get previous page
      queries = [...queries, endBefore(prevCursor), limitToLast(pageSize)];
    } else {
      // get initial page
      queries = [...queries, limit(pageSize)];
    }

    const documentSnapshots = await getDocs(query(collectionRef, ...queries));
    const countSnapshot = await getCountFromServer(collectionRef);
    const totalDocs = countSnapshot.data().count;
    hasCountedDocuments.current = true;

    lastPageNumRef.current = pageNum;
    let docs = documentSnapshots.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    if (transformDocuments) docs = await transformDocuments(docs);

    const totalPages = Math.ceil(totalDocs / pageSize);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;
    return { docs, totalDocs, totalPages, hasNextPage, hasPrevPage };
  };

  const fetchNextPage = () => setPageNum((n) => n + 1); // handle hasNextPage

  const fetchPreviousPage = () => !!pageNum && setPageNum((n) => n - 1);
  const queryState = useQuery({
    queryKey: [
      'collection',
      collectionName,
      match,
      pageNum,
      orderByField,
      reverseOrder,
      ids,
    ],
    queryFn: fetchPage,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!queryState.data) return;
    lastPageRef.current = queryState.data;
  }, [queryState.data]);

  return {
    ...queryState,
    fetchNextPage,
    fetchPreviousPage,
    page: pageNum,
  };
};

export default useFirestoreCollectionQuery;
