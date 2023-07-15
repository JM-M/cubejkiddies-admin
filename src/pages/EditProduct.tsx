import { RouteComponentProps } from 'react-router';
import Page from '../components/Page';
import ProductForm from '../components/ProductForm';

interface ProductPageProps
  extends RouteComponentProps<{
    productId: string;
  }> {}

const EditProduct: React.FC<ProductPageProps> = ({ match }) => {
  const { productId } = match.params;
  return (
    <Page
      title='Edit product'
      backButtonHref={`/products/${productId}/preview`}
      backButton
    >
      <ProductForm productId={productId} />
    </Page>
  );
};

export default EditProduct;
