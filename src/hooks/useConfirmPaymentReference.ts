import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type Props = { paymentReference: string };

const useConfirmPaymentReference = ({ paymentReference }: Props) => {
  const confirmQuery = async () => {
    if (!paymentReference)
      throw new Error('Unable to confirm payment. No payment reference.');
    const verificationEndpoint = `https://api.paystack.co/transaction/verify/${paymentReference}`;
    const { data: verificationResponse } = await axios.get(
      verificationEndpoint,
      {
        headers: {
          Authorization: `Bearer ${
            import.meta.env.VITE_TEST_PAYSTACK_SECRET_KEY
          }`,
        },
      }
    );
    return {
      verified: verificationResponse?.data.status === 'success',
      data: verificationResponse?.data,
    };
  };

  const confirmationQuery = useQuery({
    queryKey: ['confirm-payment', paymentReference],
    queryFn: confirmQuery,
    staleTime: Infinity,
  });
  return { confirmationQuery };
};

export default useConfirmPaymentReference;
