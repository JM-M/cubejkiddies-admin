import { useMutation } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import useTerminal from './useTerminal';
import useOrders from './useOrders';
import useFirestoreDocumentMutation from './useFirestoreDocumentMutation';
import getFirestoreDocument from '../utils/firebase/getFirestoreDocument';
import setFirestoreDocument from '../utils/firebase/setFirestoreDocument';
import { createShipment, arrangePickupAndDelivery } from '../utils/terminal';

type Props = { orderId: string };

const usePlaceTerminalOrder = ({ orderId }: Props) => {
  const { defaultSenderAddressQuery, defaultSenderAddress } = useTerminal();
  const { isLoading } = defaultSenderAddressQuery;

  const { order, orderQuery } = useOrders({
    orderId,
  });

  const { firestoreDocumentMutation: orderMutation } =
    useFirestoreDocumentMutation({
      collectionName: 'orders',
      invalidateDocumentQuery: true,
    });

  const placeTerminalOrder = async (cart: any) => {
    if (!defaultSenderAddress || !cart || isLoading || orderQuery.isLoading)
      return;

    const address_from = defaultSenderAddress.address_id;
    const address_to = cart?.checkout?.address?.addressId;
    const products = cart?.products;
    const { parcel, includesInsurance, rateId } =
      cart?.checkout?.delivery || {};

    const { shipment_id } = await createShipment({
      address_from,
      address_to,
      parcel,
      shipment_purpose: 'commercial',
      metadata: {
        products: products.map(({ id, variant, qty }: any) => ({
          id,
          variant,
          qty,
        })),
      },
    });
    const pickupData = {
      rate_id: rateId,
      shipment_id,
      purchase_insurance: includesInsurance,
    };

    const pickup = await arrangePickupAndDelivery(pickupData);

    const variantsMatch = (variant1: any, variant2: any) => {
      if (!variant1 || !variant2) return false;
      const variants1Length = Object.keys(variant1).length;
      const variants2Length = Object.keys(variant2).length;
      if (variants1Length !== variants2Length) return false;
      let match = true;
      for (const key in variant1) {
        if (Object.prototype.hasOwnProperty.call(variant1, key)) {
          if (variant1[key] !== variant2[key]) {
            match = false;
            break;
          }
        }
      }
      return match;
    };

    for (const cartProduct of products) {
      const { qty, id, variant } = cartProduct;
      const fetchedProduct = await getFirestoreDocument({
        collectionName: 'products',
        documentId: id,
      });
      const updatedStocks = fetchedProduct?.stocks.map((stock: any) => {
        const match = variantsMatch(stock.variationCombination, variant);
        if (match) return { ...stock, quantity: stock.quantity - qty };
        return stock;
      });
      const updatedProduct = { ...fetchedProduct, stocks: updatedStocks };
      await setFirestoreDocument({
        collectionName: 'products',
        documentId: id as string,
        document: updatedProduct,
      });
    }

    await setFirestoreDocument({
      collectionName: 'pickups',
      document: pickup,
      documentId: (pickup.id || uuidv4()) as string,
    });

    await orderMutation.mutateAsync({
      document: { ...order, terminalOrderPlaced: true },
      documentId: orderId,
    });

    return pickup;
  };

  const placeTerminalOrderMutation = useMutation({
    mutationKey: ['place-terminal-order-mutation'],
    mutationFn: placeTerminalOrder,
  });

  return { placeTerminalOrderMutation };
};

export default usePlaceTerminalOrder;
