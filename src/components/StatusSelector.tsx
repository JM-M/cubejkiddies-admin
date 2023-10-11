import { useRef } from 'react';
import { IonActionSheet } from '@ionic/react';
import { v4 as uuidv4 } from 'uuid';
import Status from './Status';
import Button from './Button';
import { statusColors } from '../constants/orderStatuses';

interface Props {
  status?: string;
  statusOptions: string[];
  setStatus: Function;
  loading?: boolean;
  trigger: string;
}

const StatusSelector: React.FC<Props> = ({
  status = '',
  statusOptions = [],
  setStatus,
  loading = false,
  trigger,
}) => {
  const buttons = statusOptions.map((status) => {
    const color = statusColors[status];
    return {
      text: status,
      handler: () => setStatus(status),
      htmlAttributes: {
        className: `block h-12 w-full px-5 text-${color}-500`,
      },
    };
  });
  return (
    <div className='flex items-center gap-1'>
      <Status status={status} loading={loading} />
      <Button fill='outline' id={trigger} disabled={loading}>
        Change
      </Button>
      <IonActionSheet
        trigger={trigger}
        header='Select status'
        buttons={[
          ...buttons,
          {
            text: 'Close',
            role: 'cancel',
            data: {
              action: 'cancel',
            },
            htmlAttributes: {
              className: `block h-10 w-fit mb-5 mt-2 mr-5 ml-auto px-5 bg-[var(--ion-color-primary)] text-white rounded-md`,
            },
          },
        ]}
      ></IonActionSheet>
    </div>
  );
};

export default StatusSelector;
