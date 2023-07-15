import DefaultProductVariations from './DefaultProductVariations';
import CustomProductVariations from './CustomProductVariations';

const ProductVariations: React.FC<{
  variations: any;
  setProductVariant: Function;
}> = ({ variations, setProductVariant = () => null }) => {
  const { colors, sizes, ...rest } = variations;
  return (
    <div className='pt-[30px]'>
      <DefaultProductVariations
        colors={colors}
        sizes={sizes}
        setProductVariant={setProductVariant}
      />
      <CustomProductVariations
        variations={rest}
        setProductVariant={setProductVariant}
      />
    </div>
  );
};

export default ProductVariations;
