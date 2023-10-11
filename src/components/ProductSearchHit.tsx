import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IonImg, IonIcon } from '@ionic/react';
import { checkmarkCircle, ellipseOutline } from 'ionicons/icons';
import { Highlight } from 'react-instantsearch';
import cx from 'classnames';
import useCategories from '../hooks/useCategories';
import { NAIRA } from '../constants/unicode';

interface Props {
  hit: any;
  selectable?: boolean;
  onSelectionChange?: (selction: boolean) => any;
  selected?: boolean;
}

const ProductSearchHit: React.FC<Props> = ({
  hit = {},
  selectable = false,
  onSelectionChange = () => null,
  selected: externalSelected = false,
}) => {
  const { image, name, category, price, objectID } = hit;
  const [selected, setSelected] = useState<boolean>(externalSelected);

  const selectionChangeHandlerRef = useRef<Function>(onSelectionChange);

  const { getCategoryFromId } = useCategories();

  const clickHandler = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
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
      className='h-[24px] w-[24px]'
    />
  );
  return (
    <div className='flex justify-between' onClick={clickHandler}>
      <Link
        to={`/products/${objectID}/preview`}
        className={cx('block', { 'pointer-events-none': selectable })}
      >
        <article className='flex gap-3 mb-5'>
          <div className='h-[75px] w-[62px] bg-gray-200 dark:bg-neutral-700 rounded-[10px] overflow-hidden'>
            {image && (
              <IonImg
                src={image}
                alt={name}
                className='h-full w-full bg-gray-200 object-cover'
              />
            )}
          </div>
          <div className='flex-[3]'>
            <Highlight attribute='name' hit={hit} />
            <p className='text-gray-700'>
              {/* <Highlight attribute="category" hit={hit} /> */}
              <span>{getCategoryFromId(category)?.name}</span>
            </p>
            <p className='text-lg'>
              {NAIRA}
              {price}
            </p>
          </div>
        </article>
      </Link>
      {checkbox}
    </div>
  );
};

export default ProductSearchHit;
