import { IonButton, IonIcon } from '@ionic/react';
import { logoWhatsapp, callOutline, mailOutline } from 'ionicons/icons';

import Page from '../components/Page';
import OrderCartTable from '../components/OrderCartTable';
import OrderAddress from '../components/OrderAddress';
import StatusSelector from '../components/StatusSelector';

const Order: React.FC<any> = ({ match }) => {
  return (
    <Page
      title={`Order #${match.params.orderId}`}
      backButtonHref='/orders'
      backButton
    >
      <h3 className='mt-6 mb-1 text-gray-500'>User</h3>
      <div>Jane Doe</div>
      <div className='grid grid-cols-3 gap-2'>
        <IonButton fill='outline'>
          <IonIcon icon={callOutline} slot='start' />
          Call
        </IonButton>
        <IonButton fill='outline'>
          <IonIcon icon={mailOutline} slot='start' />
          Email
        </IonButton>
        <IonButton fill='outline' color='success'>
          <IonIcon icon={logoWhatsapp} slot='start' />
          Whatsapp
        </IonButton>
      </div>
      <h3 className='mt-6 mb-1 text-gray-500'>Cart</h3>
      <OrderCartTable />
      <h3 className='mt-6 mb-1 text-gray-500'>Status</h3>
      <StatusSelector />
      <h3 className='mt-6 mb-1 text-gray-500'>Delivery Address</h3>
      <OrderAddress />
    </Page>
  );
};

export default Order;
