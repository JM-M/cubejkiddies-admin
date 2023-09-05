import { useRef } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';

const NewProductSectionOptions: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);

  const closeModal = () => {
    modal.current?.dismiss();
  };

  return (
    <IonModal
      ref={modal}
      trigger='custom-product-section'
      initialBreakpoint={0.35}
      breakpoints={[0.35]}
    >
      <IonHeader className='ion-no-border'>
        <IonToolbar>
          <IonTitle>Section options</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={closeModal}>
              <IonIcon icon={closeOutline} className='h-[24px] w-[24px]' />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent color='white' class='ion-padding'>
        <div className='flex flex-col gap-3'>
          <div>
            <IonButton
              routerLink='/home-product-sections/new/custom'
              fill='outline'
              className='h-10 w-full mb-2'
              onClick={closeModal}
            >
              Select products
            </IonButton>
          </div>
          <div>
            <IonButton
              routerLink='/home-product-sections/new/category'
              fill='outline'
              className='h-10 w-full mb-2'
              onClick={closeModal}
            >
              Use product category
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default NewProductSectionOptions;
