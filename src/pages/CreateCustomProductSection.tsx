import Page from '../components/Page';
import ProductSectionForm from '../components/ProductSectionForm';

const CreateCustomProductSection = () => {
  return (
    <Page
      title='Create product section'
      backButtonHref='/home-product-sections'
      backButton
    >
      <ProductSectionForm />
    </Page>
  );
};

export default CreateCustomProductSection;
