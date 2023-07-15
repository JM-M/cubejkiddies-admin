import { NAIRA } from '../constants/unicode';
import ProductStars from './ProductStars';

const ProductInfo: React.FC<{
  name: string;
  price: number;
  discount: number;
}> = ({ name, price, discount }) => {
  let displayPrice = price;
  if (!!discount) displayPrice = price - (discount / 100) * price;

  return (
    <div className='pt-4 flex flex-col gap-[10px]'>
      <h3 className='font-medium'>{name}</h3>
      <span>
        {NAIRA} {displayPrice}
      </span>
      <ProductStars />
    </div>
  );
};

export default ProductInfo;
