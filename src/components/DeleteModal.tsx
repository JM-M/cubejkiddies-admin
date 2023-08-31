import { ReactNode, useRef } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonSpinner,
  IonIcon,
  IonTitle,
  IonContent,
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';

interface Props {
  deleteHandler: Function;
  deleting: boolean;
  children?: string | ReactNode;
}

const DeleteModal = ({
  deleteHandler = () => null,
  deleting,
  children = 'Are you sure you want to delete this item?',
  ...rest
}: Props & any) => {
  const modal = useRef<HTMLIonModalElement>(null);

  const closeModal = () => {
    modal.current?.dismiss();
  };

  return (
    <IonModal
      ref={modal}
      initialBreakpoint={0.25}
      breakpoints={[0.25]}
      {...rest}
    >
      <IonHeader className='ion-no-border'>
        <IonToolbar>
          <IonTitle>Delete admin</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={closeModal}>
              <IonIcon icon={closeOutline} className='h-[24px] w-[24px]' />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent color='white' className='ion-padding'>
        <div className='block my-5'>{children}</div>
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
      </IonContent>
    </IonModal>
  );
};

export default DeleteModal;
