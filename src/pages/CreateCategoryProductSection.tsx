import Page from '../components/Page';
import ProductSectionCategorySelector from '../components/ProductSectionCategorySelector';

const CreateCategoryProductSelection = () => {
  return (
    <Page
      title='Create category section'
      backButtonHref='/home-product-sections'
      backButton
    >
      <ProductSectionCategorySelector />
    </Page>
  );
};

export default CreateCategoryProductSelection;
