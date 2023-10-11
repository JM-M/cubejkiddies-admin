import { IonSpinner } from '@ionic/react';
import Tag from './Tag';
import { statusColors } from '../constants/orderStatuses';

const Status: React.FC<{ status: string; loading?: boolean }> = ({
  status,
  loading = false,
}) => {
  if (loading)
    return (
      <span className='inline-flex justify-center w-[80px]'>
        <IonSpinner name='crescent' className='h-[20px] w-[20px]' />
      </span>
    );

  let color = 'gray';
  if (statusColors[status]) color = statusColors[status];

  return <Tag color={color} text={status} />;
};

export default Status;
