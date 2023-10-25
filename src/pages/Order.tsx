import Page from '../components/Page';
import OrderCartTable from '../components/OrderCartTable';
import Address from '../components/Address';
import StatusSelector from '../components/StatusSelector';
import OrderContact from '../components/OrderContact';
import PageLoader from '../components/PageLoader';
import OrderPayment from '../components/OrderPayment';
import OrderLogistics from '../components/OrderLogistics';
import useOrders from '../hooks/useOrders';
import orderStatuses from '../constants/orderStatuses';

const Order: React.FC<any> = ({ match }) => {
  const { orderId } = match.params;

  const { order, orderQuery, updateOrderStatusMutation } = useOrders({
    orderId,
  });

  if (orderQuery.isLoading) return <PageLoader />;
  if (!order) return <>No data found</>;
  const {
    user,
    cart,
    statusEvents = [],
    paymentReference,
    terminalOrderPlaced,
  } = order!;
  const { products, checkout = {} } = cart;
  const { contact = {}, address = {}, delivery } = checkout as any;

  let status = '';
  if (statusEvents?.length)
    status = statusEvents[statusEvents.length - 1].status;

  return (
    <Page title={`#${orderId}`} backButtonHref='/orders' backButton>
      <h3 className='mt-6 mb-1 text-gray-500'>User</h3>
      <OrderContact {...user} {...contact} />
      <h3 className='mt-6 mb-1 text-gray-500'>Cart</h3>
      <OrderCartTable products={products} deliveryFee={delivery?.price} />
      <h3 className='mt-6 mb-1 text-gray-500'>Payment</h3>
      <OrderPayment paymentReference={paymentReference} />
      <h3 className='mt-6 mb-1 text-gray-500'>Logistics</h3>
      <OrderLogistics
        cart={cart}
        orderId={orderId}
        terminalOrderPlaced={terminalOrderPlaced}
      />
      <h3 className='mt-6 mb-1 text-gray-500'>Order status</h3>
      <StatusSelector
        status={status}
        statusOptions={orderStatuses}
        setStatus={updateOrderStatusMutation.mutate}
        loading={updateOrderStatusMutation.isLoading}
        trigger='order-status'
      />
      <h3 className='mt-6 mb-1 text-gray-500'>Delivery Address</h3>
      <Address {...address} />
    </Page>
  );
};

export default Order;
