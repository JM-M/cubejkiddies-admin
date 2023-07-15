import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonIcon,
  useIonRouter,
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { PropsWithChildren } from 'react';

interface Props {
  title: string;
  backButtonHref?: string;
  backButton?: boolean;
}

const Page = ({
  title,
  backButton = false,
  backButtonHref,
  children,
}: PropsWithChildren<Props>) => {
  const ionRouter = useIonRouter();
  const { canGoBack, goBack, push } = ionRouter;

  const back = () => {
    if (backButtonHref) return push(backButtonHref, 'back');
    return canGoBack() && goBack();
  };

  return (
    <>
      <IonHeader className='p-0 ion-no-border mb-3'>
        <IonToolbar>
          {(canGoBack() || backButtonHref) && backButton && (
            <IonButtons slot='start' className='relative right-3'>
              <IonButton onClick={back}>
                <IonIcon
                  icon={arrowBackOutline}
                  color='dark'
                  className='h-[20px] w-[20px]'
                />
              </IonButton>
            </IonButtons>
          )}
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      {children}
    </>
  );
};

export default Page;
