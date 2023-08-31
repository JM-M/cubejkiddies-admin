import { RouteComponentProps } from 'react-router';
import Page from '../components/Page';
import ProductSectionForm from '../components/ProductSectionForm';
import PageLoader from '../components/PageLoader';
import useProductSections, {
  DatabaseProductSection,
} from '../hooks/useProductSections';
import ProductSectionCategorySelector from '../components/ProductSectionCategorySelector';

interface Props
  extends RouteComponentProps<{
    sectionId: string;
  }> {}

const EditProductSection: React.FC<Props> = ({ match }) => {
  const { sectionId } = match.params;
  const { productSectionsQuery } = useProductSections();
  if (productSectionsQuery.isLoading) return <PageLoader />;
  const sections = productSectionsQuery?.data;
  const section = sections.find(
    (s: DatabaseProductSection) => s.id === sectionId
  );
  if (!section)
    return (
      <div className='h-fit w-fit m-auto text-gray-500'>
        No section data found
      </div>
    );

  let display = <PageLoader />;
  if (section.category) {
    display = <ProductSectionCategorySelector sectionId={sectionId} />;
  } else {
    display = <ProductSectionForm sectionId={sectionId} />;
  }

  return (
    <Page
      title='Edit product section'
      backButtonHref='/home-product-sections'
      backButton
    >
      {display}
    </Page>
  );
};

export default EditProductSection;
