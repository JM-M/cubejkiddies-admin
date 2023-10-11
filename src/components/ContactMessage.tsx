import { callOutline, mailOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import format from 'date-fns/format';
import Button from './Button';
import { ContactMessage as ContactMessageType } from '../hooks/useContactMessages';

const ContactMessage = ({ user, createdAt, message }: ContactMessageType) => {
  return (
    <div className='mb-5 p-5 bg-gray-100 rounded-lg'>
      <div className='mb-3'>
        <div>
          {user.firstName} {user.lastName}
        </div>
        <div>
          <span>{user?.email}</span>
        </div>
        {createdAt && <div>{format(createdAt.toDate(), 'dd MMM yyyy')}</div>}
      </div>
      <div>{message}</div>
      <div className='flex gap-2 mt-3'>
        <Button fill='outline'>
          <IonIcon icon={callOutline} className='inline-block mr-2' />
          Call
        </Button>
        <Button fill='outline' routerLink={`mailto:${user.email}`}>
          <IonIcon icon={mailOutline} className='inline-block mr-2' />
          Email
        </Button>
      </div>
    </div>
  );
};

export default ContactMessage;
