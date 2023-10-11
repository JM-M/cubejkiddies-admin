import Page from '../components/Page';
import OrderCartTable from '../components/OrderCartTable';
import Address from '../components/Address';
import StatusSelector from '../components/StatusSelector';
import OrderContact from '../components/OrderContact';
import PageLoader from '../components/PageLoader';
import useOrders from '../hooks/useOrders';
import orderStatuses from '../constants/orderStatuses';

const Order: React.FC<any> = ({ match }) => {
  const { orderId } = match.params;

  const {
    order,
    orderQuery,
    updateOrderStatusMutation,
    updateOrderPaymentStatusMutation,
    updateOrderTerminalStatusMutation,
  } = useOrders({
    orderId,
  });

  if (orderQuery.isLoading) return <PageLoader />;
  if (!order) return 'No data found';
  const { user, cart, statusEvents = [], terminalOrderError = {} } = order!;
  const { products, checkout = {} } = cart;
  const { contact = {}, address = {} } = checkout as any;

  let status = '';
  if (statusEvents?.length)
    status = statusEvents[statusEvents.length - 1].status;

  const paymentStatus = order.paymentVerified ? 'success' : 'error';
  const terminalOrderStatus = order.terminalOrderPlaced ? 'success' : 'error';
  const { message: terminalOrderErrorMessage = '' } = terminalOrderError as any;

  const statusOptions = ['success', 'error'];

  return (
    <Page title={`#${orderId}`} backButtonHref='/orders' backButton>
      <h3 className='mt-6 mb-1 text-gray-500'>User</h3>
      <OrderContact {...user} {...contact} />
      <h3 className='mt-6 mb-1 text-gray-500'>Cart</h3>
      <OrderCartTable products={products} />
      <h3 className='mt-6 mb-1 text-gray-500'>Order status</h3>
      <StatusSelector
        status={status}
        statusOptions={orderStatuses}
        setStatus={updateOrderStatusMutation.mutate}
        loading={updateOrderStatusMutation.isLoading}
        trigger='order-status'
      />
      <h3 className='mt-6 mb-1 text-gray-500'>Payment verified</h3>
      <StatusSelector
        status={paymentStatus}
        statusOptions={statusOptions}
        setStatus={updateOrderPaymentStatusMutation.mutate}
        loading={updateOrderPaymentStatusMutation.isLoading}
        trigger='order-payment-status'
      />
      <h3 className='mt-6 mb-1 text-gray-500'>Terminal order placed</h3>
      <StatusSelector
        status={terminalOrderStatus}
        statusOptions={statusOptions}
        setStatus={updateOrderTerminalStatusMutation.mutate}
        loading={updateOrderTerminalStatusMutation.isLoading}
        trigger='order-terminal-status'
      />
      {terminalOrderErrorMessage && (
        <div className='mt-1 text-red-700'>{terminalOrderErrorMessage}</div>
      )}
      <h3 className='mt-6 mb-1 text-gray-500'>Delivery Address</h3>
      <Address {...address} />
    </Page>
  );
};

export default Order;
