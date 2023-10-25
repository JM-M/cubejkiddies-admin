import Tag from './Tag';
import Button from './Button';
import useConfirmPaymentReference from '../hooks/useConfirmPaymentReference';
import { NAIRA } from '../constants/unicode';

type Props = { paymentReference: string };

const OrderPayment = ({ paymentReference }: Props) => {
  const { confirmationQuery } = useConfirmPaymentReference({
    paymentReference,
  });
  const { isLoading, data } = confirmationQuery;
  if (isLoading)
    return (
      <Button fill='clear' className='h-10 w-fit !opacity-100' loading>
        Loading
      </Button>
    );
  if (!data?.verified) return <Tag color='red' text='Not confirmed' />;
  const amountPayed = `${NAIRA} ${data.data.amount / 100}`;
  return (
    <div className='flex items-center gap-3'>
      <span>{amountPayed}</span>
      <Tag color='green' text='Confirmed' />
    </div>
  );
};

export default OrderPayment;
