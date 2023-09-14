import ProductSectionCard from './ProductSectionCard';
import useProductSections, {
  DatabaseProductSection,
} from '../hooks/useProductSections';
import PageLoader from './PageLoader';

const ProductSectionList = () => {
  const { productSectionsQuery } = useProductSections();

  if (productSectionsQuery.isFetching) return <PageLoader />;

  return (
    <ul className='my-5'>
      {productSectionsQuery.data?.docs?.map(
        (productSection: DatabaseProductSection, index: number) => {
          const { title, id = '' } = productSection;
          return (
            <li key={index} className='mb-5'>
              <ProductSectionCard title={title} sectionId={id} />
            </li>
          );
        }
      )}
    </ul>
  );
};

export default ProductSectionList;
