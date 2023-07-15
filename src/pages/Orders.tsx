import Page from '../components/Page';
import QueryController from '../components/QueryController';
import OrdersTable from '../components/OrdersTable';

const Orders: React.FC = () => {
  return (
    <Page title='Orders'>
      <div className='flex justify-end my-5'>
        <QueryController />
      </div>
      <OrdersTable />
    </Page>
  );
};

export default Orders;
