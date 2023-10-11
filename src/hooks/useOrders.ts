import { Timestamp } from 'firebase/firestore';
import useFirestoreDocumentQuery from './useFirestoreDocumentQuery';
import useFirestoreCollectionQuery from './useFirestoreCollectionQuery';
import { Cart } from './useCart';
import { User } from './useUsers';
import useCollectionInfiniteQuery from './useCollectionInfiniteQuery';
import { useMutation } from '@tanstack/react-query';
import useFirestoreDocumentMutation from './useFirestoreDocumentMutation';

export type StatusEvent = { status: string; time: Timestamp };

export interface Order {
  paymentReference: string;
  cart: Cart;
  user: User & { id: string };
  userId: string;
  id?: string;
  statusEvents?: StatusEvent[];
  createdAt?: Timestamp;
  paymentVerified?: boolean;
  terminalOrderPlaced?: boolean;
  terminalOrderError?: { message: string };
}

interface Props {
  orderId?: string;
}

const collectionName = 'orders';
const useOrders = (props: Props = {}) => {
  const { orderId } = props;

  const orderQuery = useFirestoreDocumentQuery({
    collectionName,
    documentId: orderId,
  });
  const order: Order | undefined = orderQuery.data;

  const { firestoreDocumentMutation: orderMutation } =
    useFirestoreDocumentMutation({ collectionName });

  const ordersQuery = useCollectionInfiniteQuery({
    collectionName,
    pageSize: 10,
    orderByField: 'createdAt',
  });
  const orders = ordersQuery.data?.allDocs || [];

  const updateOrderStatusMutation = useMutation({
    mutationKey: ['update-order-status-mutation'],
    mutationFn: async (status: string) => {
      if (!order) throw new Error('Order is loaded or is unavailable');
      const now = Timestamp.now();
      const newOrder: Order = {
        ...order,
        statusEvents: [...(order.statusEvents || []), { status, time: now }],
      };
      await orderMutation.mutateAsync({
        document: newOrder,
        documentId: orderId!,
      });
    },
  });

  const updateOrderPaymentStatusMutation = useMutation({
    mutationKey: ['update-order-payment-status-mutation'],
    mutationFn: async (paymentStatus: string) => {
      if (!order) throw new Error('Order is loaded or is unavailable');
      const newOrder = {
        ...order,
        paymentVerified: paymentStatus === 'success' ? true : false,
      };
      await orderMutation.mutateAsync({
        document: newOrder,
        documentId: orderId!,
      });
    },
  });

  const updateOrderTerminalStatusMutation = useMutation({
    mutationKey: ['update-order-terminal-status-mutation'],
    mutationFn: async (terminalStatus: string) => {
      if (!order) throw new Error('Order is loaded or is unavailable');
      let newOrder = order;
      if (terminalStatus === 'success') {
        newOrder = {
          ...order,
          terminalOrderPlaced: true,
        };
        delete newOrder['terminalOrderError'];
      } else {
        newOrder = {
          ...order,
          terminalOrderPlaced: false,
        };
      }
      await orderMutation.mutateAsync({
        document: newOrder,
        documentId: orderId!,
      });
    },
  });

  return {
    order,
    orderQuery,
    orders,
    ordersQuery,
    updateOrderStatusMutation,
    orderMutation,
    updateOrderPaymentStatusMutation,
    updateOrderTerminalStatusMutation,
  };
};

export default useOrders;
