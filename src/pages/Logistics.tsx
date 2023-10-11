import Page from '../components/Page';
import PickupAddressForm from '../components/PickupAddressForm';

const Orders: React.FC = () => {
  return (
    <Page title='Logistics settings'>
      <PickupAddressForm />
    </Page>
  );
};

export default Orders;
