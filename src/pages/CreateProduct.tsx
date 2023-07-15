import Page from '../components/Page';
import ProductForm from '../components/ProductForm';

const CreateProduct: React.FC = () => {
  return (
    <Page title='Create new product' backButtonHref='/products' backButton>
      <ProductForm />
    </Page>
  );
};

export default CreateProduct;
