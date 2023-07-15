import { RouteComponentProps } from 'react-router';
import Page from '../components/Page';
import ProductPreview from '../components/ProductPreview';

interface ProductPageProps
  extends RouteComponentProps<{
    productId: string;
  }> {}

const Product: React.FC<ProductPageProps> = ({ match }) => {
  return (
    <Page title='Product preview' backButtonHref='/products' backButton>
      <ProductPreview productId={match.params.productId} />
    </Page>
  );
};

export default Product;
