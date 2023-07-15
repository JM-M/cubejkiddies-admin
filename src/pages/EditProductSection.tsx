import { RouteComponentProps } from 'react-router';
import Page from '../components/Page';
import ProductSectionForm from '../components/ProductSectionForm';

interface Props
  extends RouteComponentProps<{
    sectionId: string;
  }> {}

const EditProductSection: React.FC<Props> = ({ match }) => {
  const { sectionId } = match.params;
  return (
    <Page
      title='Edit product section'
      backButtonHref='/home-product-sections'
      backButton
    >
      <ProductSectionForm sectionId={sectionId} />
    </Page>
  );
};

export default EditProductSection;
