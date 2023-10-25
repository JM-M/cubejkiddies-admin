import { IonImg } from '@ionic/react';
import cx from 'classnames';
import Tag from './Tag';
import Button from './Button';
import { NAIRA } from '../constants/unicode';
import usePlaceTerminalOrder from '../hooks/usePlaceTerminalOrder';
import ErrorText from './ErrorText';

type Props = { cart?: any; orderId: string; terminalOrderPlaced?: boolean };

const OrderLogistics = ({
  cart,
  orderId,
  terminalOrderPlaced = false,
}: Props) => {
  const { checkout = {} } = cart;
  const { delivery = {} } = checkout;

  const { placeTerminalOrderMutation } = usePlaceTerminalOrder({ orderId });

  if (!delivery) return <Tag color='red' text='No delivery data available' />;
  const { carrier, logo, price, estimatedDeliveryTime } = delivery;
  const errorMessage = (placeTerminalOrderMutation?.error as any)?.response
    ?.data?.message;
  return (
    <div>
      <div
        className={cx(
          'flex justify-between items-stretch p-3 bg-[var(--ion-color-light)] border border-gray-300 rounded-lg'
        )}
      >
        <div className='flex gap-3'>
          <div className='flex items-center justify-center h-12 w-12 rounded-lg bg-gray-200 overflow-hidden'>
            <IonImg src={logo} />
          </div>
          <div className='flex flex-col'>
            <h5>{carrier}</h5>
            <span className='mt-auto text-[var(--ion-color-medium)]'>
              {estimatedDeliveryTime}
            </span>
          </div>
        </div>
        <div className='flex flex-col items-end justify-between'>
          <span className='h-fit font-medium whitespace-nowrap'>
            {NAIRA} {price.toLocaleString()}
          </span>
          <Tag
            color={terminalOrderPlaced ? 'green' : 'red'}
            text={terminalOrderPlaced ? 'Placed' : 'Not placed'}
          />
        </div>
      </div>
      {!!errorMessage && (
        <ErrorText
          className='mb-2 text-right'
          text={errorMessage}
          hideHorizontalBar
        />
      )}
      {!terminalOrderPlaced && (
        <Button
          fill='outline'
          className='block w-fit mt-3 ml-auto'
          onClick={() => placeTerminalOrderMutation.mutate(cart)}
          loading={placeTerminalOrderMutation.isLoading}
        >
          Place order
        </Button>
      )}
    </div>
  );
};

export default OrderLogistics;
