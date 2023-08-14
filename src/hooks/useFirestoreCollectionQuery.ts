import { useState, useRef, useEffect } from "react";
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
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "../../firebase";

interface FirestoreInfiniteQuery {
  collectionName: string;
  match?: object;
  orderByField?: string;
  reverseOrder?: boolean;
  options: {
    pageSize: number;
  };
  ids?: string[];
}

const useFirestoreCollectionQuery = ({
  collectionName,
  orderByField,
  match,
  reverseOrder = false,
  options: { pageSize },
  ids = [],
}: FirestoreInfiniteQuery) => {
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalDocuments, setTotalDocuments] = useState<any>(1);
  const [countedDocuments, setCountedDocuments] = useState<boolean>(false);

  const lastPageRef = useRef<any>();
  const lastPage = lastPageRef.current;
  const lastPageNumRef = useRef<number>(1);
  const lastPageNum = lastPageNumRef.current;

  const getPrevCursor = () => {
    if (!lastPage?.length || !orderByField) return undefined;
    const firstDocument = lastPage[0];
    return firstDocument[orderByField];
  };

  const getNextCursor = () => {
    if (!lastPage || !orderByField) return undefined;
    const lastDocument = lastPage[lastPage.length - 1];
    return lastDocument[orderByField];
  };

  const fetchPage: (arg: any) => any = async ({ queryKey = {} }: any) => {
    const [_key] = queryKey;
    const collectionRef = collection(db, collectionName);
    let queries: any[] = orderByField
      ? [orderBy(orderByField, reverseOrder ? "asc" : "desc")]
      : [];
    if (match) {
      Object.entries(match).forEach(([key, value]) => {
        if (value) queries.unshift(where(key, "==", value));
      });
    }
    if (ids.length) queries = [where(documentId(), "in", ids)];
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
    if (!countedDocuments) {
      const countSnapshot = await getCountFromServer(collectionRef);
      setTotalDocuments(countSnapshot.data().count);
      setCountedDocuments(true);
    }

    lastPageNumRef.current = pageNum;
    return documentSnapshots.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  };

  const fetchNextPage = () => setPageNum((n) => n + 1); // handle hasNextPage

  const fetchPreviousPage = () => !!pageNum && setPageNum((n) => n - 1);
  const queryState = useQuery({
    queryKey: [
      "collection",
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

  const totalPages = Math.ceil(totalDocuments / pageSize);
  const hasNextPage = pageNum < totalPages;
  const hasPrevPage = pageNum > 1;

  return {
    ...queryState,
    fetchNextPage,
    fetchPreviousPage,
    totalDocuments,
    totalPages,
    hasNextPage,
    hasPrevPage,
    page: pageNum,
  };
};

export default useFirestoreCollectionQuery;
