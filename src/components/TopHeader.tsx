import {
  IonMenuButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import useAuth from '../hooks/useAuth';

const TopHeader = () => {
  const { admin, isLoggedIn, logout, logOutMutation } = useAuth();

  return (
    <IonHeader className='ion-no-border'>
      <IonToolbar>
        {isLoggedIn && (
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
        )}
        <IonTitle>
          {isLoggedIn ? `${admin?.firstName} ${admin?.lastName[0]}` : 'Admin'}
        </IonTitle>
        {isLoggedIn && (
          <IonButtons slot='end'>
            <IonButton
              className='rounded-[50px] overflow-hidden'
              onClick={() => isLoggedIn && logout()}
            >
              {logOutMutation.isLoading ? (
                <IonSpinner name='crescent' />
              ) : (
                <IonIcon icon={logOutOutline} />
              )}
            </IonButton>
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default TopHeader;
