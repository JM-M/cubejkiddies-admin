import Page from '../components/Page';
import DeliveryPricesEditor from '../components/DeliveryPricesEditor';

const Categories: React.FC = () => {
  return (
    <Page title='Delivery prices'>
      <DeliveryPricesEditor />
    </Page>
  );
};

export default Categories;
