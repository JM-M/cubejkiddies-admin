import { Timestamp } from "firebase/firestore";
import useFirestoreDocumentQuery from "./useFirestoreDocumentQuery";
import useFirestoreCollectionQuery from "./useFirestoreCollectionQuery";
import { Cart } from "./useCart";
import { UserFirestoreDocument } from "./useUser";

export type StatusEvent = { status: string; time: Timestamp };

export interface Order {
  paymentReference: string;
  cart: Cart;
  user: UserFirestoreDocument;
  userId: string;
  id?: string;
  statusEvents?: StatusEvent[];
  createdAt?: Timestamp;
}

interface Props {
  orderId?: string;
}

const collectionName = "orders";
const useOrders = (props: Props = {}) => {
  const { orderId } = props;

  const orderQuery = useFirestoreDocumentQuery({
    collectionName,
    documentId: orderId,
  });
  const order = orderQuery.data;

  const ordersQuery = useFirestoreCollectionQuery({
    collectionName,
    options: { pageSize: 10 },
    orderByField: "createdAt",
  });
  const orders = ordersQuery.data;

  return { order, orderQuery, orders, ordersQuery };
};

export default useOrders;
