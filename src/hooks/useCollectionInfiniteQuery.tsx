import {
  useQuery,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
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
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../../firebase';

type QueryOperator = '==' | '!=' | '<' | '<=' | '>' | '>=';
export type QueryFilter = { [key: string]: [QueryOperator, any] | undefined };

interface FirestoreInfiniteQuery {
  collectionName: string;
  match?: object;
  filter?: QueryFilter;
  orderByField: string;
  orderDirection?: 'desc' | 'asc';
  pageSize: number;
  ids?: string[];
  transformDocuments?: (docs: any[]) => Promise<any[]>;
}

type QueryData = {
  docs: any[];
  totalDocs: number;
  pageNum: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type QueryFn = (arg: any) => any;

const useCollectionInfiniteQuery = (props: FirestoreInfiniteQuery) => {
  const {
    collectionName,
    orderByField,
    match,
    filter,
    orderDirection = 'desc',
    pageSize,
    ids = [],
    transformDocuments,
  } = props;
  const collectionRef = collection(db, collectionName);

  const countFn = async () => {
    const countSnapshot = await getCountFromServer(collectionRef);
    const count = countSnapshot.data().count;
    return count;
  };

  const countQueryState = useQuery({
    queryKey: ['collection-size', collectionName],
    queryFn: countFn,
  });

  const getQueries = ({ lastSnapshot }: { lastSnapshot?: any }) => {
    const queries: QueryConstraint[] = [
      orderBy(orderByField, orderDirection),
      limit(pageSize),
    ];
    if (lastSnapshot) queries.splice(1, 0, startAfter(lastSnapshot));
    if (filter) {
      Object.entries(filter).forEach(([key, filterValue]) => {
        if (!filterValue) return;
        const [operator, value] = filterValue;
        if (value) queries.unshift(where(key, operator, value));
      });
    }
    return queries;
  };

  const queryFn: QueryFn = async ({ pageParam }: any) => {
    const queries = getQueries(pageParam ? { lastSnapshot: pageParam } : {});

    const snapshot = await getDocs(query(collectionRef, ...queries));
    let docs = snapshot?.docs.map((doc: any) => ({
      ...doc.data(),
      id: doc.id,
    }));
    if (transformDocuments) docs = await transformDocuments(docs);
    return { snapshot, docs };
  };

  const getNextPageParam = (lastPage: any) => {
    const { snapshot } = lastPage;
    return snapshot.docs[snapshot.docs.length - 1];
  };

  const totalDocs = countQueryState.data;
  const totalPages = totalDocs && Math.ceil(totalDocs / pageSize);

  const queryState = useInfiniteQuery({
    queryKey: ['collection', collectionName, props],
    queryFn,
    getNextPageParam,
    select: (data) => ({
      ...data,
      allDocs: Object.values(data.pages)
        .map((page) => page?.docs)
        .flat(),
      totalDocs,
      totalPages,
    }),
    staleTime: Infinity,
  });

  const isLoading = countQueryState.isLoading || queryState.isLoading;

  return {
    ...queryState,
    isLoading,
  } as UseInfiniteQueryResult<any, unknown> & {
    data: {
      allDocs: any[];
      pageParams: any[];
      pages: any[];
      getPageDocs: (n: number) => any[] | undefined;
      totalDocs?: number;
      totalPages?: number;
    };
  };
};

export default useCollectionInfiniteQuery;
