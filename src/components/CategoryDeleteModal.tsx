import { useRef } from 'react';
import { IonModal, IonButton, IonSpinner } from '@ionic/react';

interface Props {
  close: Function;
  open: boolean;
  categoryName: string;
  deleteHandler: Function;
  deleting: boolean;
}

const CategoryDeleteModal = ({
  close = () => null,
  open,
  categoryName = '',
  deleteHandler = () => null,
  deleting,
}: Props) => {
  const modal = useRef<HTMLIonModalElement>(null);

  return (
    <IonModal
      ref={modal}
      isOpen={open}
      onIonModalWillDismiss={() => close()}
      initialBreakpoint={0.25}
      breakpoints={[0.25]}
    >
      <div className='p-5'>
        <div className='block my-5'>
          Are you sure you want to delete the category{' '}
          <span className='font-bold'>
            {"'"}
            {categoryName}
            {"'"}
          </span>{' '}
          and all categories under it?
        </div>
        <div className='flex justify-between'>
          <IonButton
            color='danger'
            onClick={() => deleteHandler()}
            disabled={deleting}
          >
            {deleting ? (
              <IonSpinner name='dots' className='inline-block' />
            ) : (
              'Delete'
            )}
          </IonButton>
          <IonButton fill='outline' onClick={() => close()}>
            Cancel
          </IonButton>
        </div>
      </div>
    </IonModal>
  );
};

export default CategoryDeleteModal;
