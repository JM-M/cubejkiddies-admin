import { IonButton, IonIcon } from '@ionic/react';
import { logoWhatsapp, callOutline, mailOutline } from 'ionicons/icons';
import { User } from '../hooks/useUsers';
import { CheckoutContact } from '../hooks/useCart';

const OrderContact: React.FC<User & CheckoutContact> = ({
  firstName,
  lastName,
  email,
  phoneNumber,
}) => {
  return (
    <>
      <div className='mb-3'>
        {firstName} {lastName}
      </div>
      <div className='grid grid-cols-3 gap-2'>
        <a href={`tel:234${phoneNumber}`} className='block w-full'>
          <IonButton fill='outline' className='block'>
            <IonIcon icon={callOutline} slot='start' />
            Call
          </IonButton>
        </a>
        <a href={`mailto:${email}`} className='block w-full'>
          <IonButton fill='outline' className='block'>
            <IonIcon icon={mailOutline} slot='start' />
            Email
          </IonButton>
        </a>
        {/* <IonButton fill="outline" color="success">
          <IonIcon icon={logoWhatsapp} slot="start" />
          Whatsapp
        </IonButton> */}
      </div>
    </>
  );
};

export default OrderContact;
