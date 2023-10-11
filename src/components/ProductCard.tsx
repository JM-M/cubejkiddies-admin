import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IonIcon, IonImg } from '@ionic/react';
import { checkmarkCircle, ellipseOutline } from 'ionicons/icons';
import cx from 'classnames';
import { NAIRA } from '../constants/unicode';
import { Product } from '../constants/schemas/product';
import useCategories from '../hooks/useCategories';

interface Props {
  product: Product;
  selectable?: boolean;
  onSelectionChange?: (selction: boolean) => any;
  selected?: boolean;
  controlled?: boolean;
}

const ProductCard = ({
  product,
  selectable = false,
  onSelectionChange = () => null,
  selected: externalSelected = false,
  controlled = false,
}: Props) => {
  const { name, price, category, stocks = [], id, discount } = product;

  const [selected, setSelected] = useState<boolean>(externalSelected);

  useEffect(() => {
    if (!controlled || selected === externalSelected) return;
    setSelected(externalSelected);
  }, [controlled, externalSelected]);

  const selectionChangeHandlerRef = useRef<Function>(onSelectionChange);

  const { getCategoryFromId } = useCategories();
  const categoryName = getCategoryFromId(category)?.name;

  const clickHandler = () => {
    if (!selectable) return;
    if (selected) {
      setSelected(false);
      selectionChangeHandlerRef.current(false);
      return;
    }
    setSelected(true);
    selectionChangeHandlerRef.current(true);
  };

  const checkbox = selectable && (
    <IonIcon
      color='primary'
      icon={selected ? checkmarkCircle : ellipseOutline}
      className='absolute right-1 top-1 h-[24px] w-[24px]'
    />
  );

  const image =
    stocks.length && stocks[0].images?.length && stocks[0].images[0];

  const discountedPrice = discount && price - price * (discount / 100);

  return (
    <div
      className={cx('relative rounded-xl overflow-hidden', {
        'border-2 border-transparent': selectable,
        'border-[var(--ion-color-primary)]': selectable && selected,
      })}
      onClick={clickHandler}
    >
      {checkbox}
      <Link
        to={`/products/${id}/preview`}
        className={cx('block', { 'pointer-events-none': selectable })}
      >
        <div className='flex justify-center items-center w-full aspect-[5/6] mb-[10px] bg-gray-100 rounded-lg overflow-hidden'>
          {image ? (
            <IonImg
              src={image as string}
              alt={name}
              className='h-full w-full bg-gray-200 object-cover'
            />
          ) : (
            <span className='text-gray-500'>No image added</span>
          )}
        </div>
      </Link>
      <div>
        <div>
          <span className='block font-medium'>{name}</span>
        </div>
        <div>
          <span className='text-xs text-gray-500'>{categoryName}</span>
        </div>
        <div className='flex gap-2'>
          <span
            className={cx('inline-block -mb-[2px] text-base', {
              'line-through text-gray-700': discountedPrice,
            })}
          >
            {NAIRA}
            {price.toLocaleString()}
          </span>
          {discountedPrice && (
            <span className='inline-block -mb-[2px] text-base'>
              {NAIRA}
              {discountedPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
