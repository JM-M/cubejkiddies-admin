import Status from './Status';
import { IonButton } from '@ionic/react';

const StatusSelector = () => {
  return (
    <div className='flex items-center gap-1'>
      <Status status='en-route' /> <IonButton fill='clear'>Change</IonButton>
    </div>
  );
};

export default StatusSelector;
