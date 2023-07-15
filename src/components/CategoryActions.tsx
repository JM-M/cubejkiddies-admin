import { IonIcon } from '@ionic/react';
import cx from 'classnames';
import { addOutline, pencilOutline, trashBinOutline } from 'ionicons/icons';

interface Props {
  onAdd: Function;
  onEdit: Function;
  onDelete: Function;
  className?: string;
}

const CategoriesActions = ({
  onAdd,
  onEdit,
  onDelete,
  className = '',
}: Props) => {
  return (
    <div className={cx('flex gap-3 items-center flex-wrap', className)}>
      <IonIcon
        color='primary'
        icon={addOutline}
        className='h-[24px] w-[24px]'
        onClick={() => onAdd()}
      />
      <IonIcon
        color='primary'
        icon={pencilOutline}
        className='h-[20px] w-[20px]'
        onClick={() => onEdit()}
      />
      <IonIcon
        color='danger'
        icon={trashBinOutline}
        className='h-[20px] w-[20px]'
        onClick={() => onDelete()}
      />
    </div>
  );
};

export default CategoriesActions;
