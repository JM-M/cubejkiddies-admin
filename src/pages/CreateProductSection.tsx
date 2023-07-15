import Page from '../components/Page';
import ProductSectionForm from '../components/ProductSectionForm';

const CreateProductSection = () => {
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

export default CreateProductSection;
