import Page from "../components/Page";
import OrderCartTable from "../components/OrderCartTable";
import Address from "../components/Address";
import StatusSelector from "../components/StatusSelector";
import OrderContact from "../components/OrderContact";
import PageLoader from "../components/PageLoader";
import useOrders from "../hooks/useOrders";

const Order: React.FC<any> = ({ match }) => {
  const { orderId } = match.params;

  const { order, orderQuery } = useOrders({ orderId });

  if (orderQuery.isLoading) return <PageLoader />;
  const { user, cart, statusEvents = [] } = order;
  const {
    products,
    checkout: { contact = {}, address = {} },
  } = cart;

  let status = "";
  if (statusEvents?.length)
    status = statusEvents[statusEvents.length - 1].status;

  return (
    <Page title={`#${orderId}`} backButtonHref="/orders" backButton>
      <h3 className="mt-6 mb-1 text-gray-500">User</h3>
      <OrderContact {...user} {...contact} />
      <h3 className="mt-6 mb-1 text-gray-500">Cart</h3>
      <OrderCartTable products={products} />
      <h3 className="mt-6 mb-1 text-gray-500">Status</h3>
      <StatusSelector status={status} />
      <h3 className="mt-6 mb-1 text-gray-500">Delivery Address</h3>
      <Address {...address} />
    </Page>
  );
};

export default Order;
