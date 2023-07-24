import {
  IonMenuButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';

const TopHeader = () => {
  return (
    <IonHeader className='ion-no-border'>
      <IonToolbar>
        <IonButtons slot='start'>
          <IonMenuButton />
        </IonButtons>
        <IonTitle>Admin</IonTitle>
        <IonButtons slot='end'>
          <IonButton className='rounded-[50px] overflow-hidden'>
            <IonIcon icon={logOutOutline} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default TopHeader;
