import { useState, useRef } from 'react';
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
  initiallySelected?: boolean;
}

const ProductCard = ({
  product,
  selectable = false,
  onSelectionChange = () => null,
  initiallySelected = false,
}: Props) => {
  const { name, price, category, stocks = [], id } = product;

  const [selected, setSelected] = useState<boolean>(initiallySelected);

  const selectionChangeHandlerRef = useRef<Function>(onSelectionChange);

  const { getCategoryNameFromValue } = useCategories();

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

  return (
    <div
      className={cx('relative rounded-xl overflow-hidden', {
        'border-2 border-transparent': selectable,
        'border-[var(--ion-color-primary-tint)]': selectable && selected,
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
            <IonImg src={image as string} alt={name} />
          ) : (
            <span className='text-gray-500'>No image added</span>
          )}
        </div>
      </Link>
      <div className={cx('flex justify-between', { 'p-1': selectable })}>
        <div className='flex flex-col'>
          <span className='block font-medium'>{name}</span>
          <span className='text-xs text-gray-500'>
            {getCategoryNameFromValue(category)}
          </span>
        </div>
        <span className='text-base'>
          {NAIRA} {price}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
