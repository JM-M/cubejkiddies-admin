import { useMutation, useQuery } from '@tanstack/react-query';

const usePickupAddress = () => {
  const updatePickupAddress = async (address: any) => {};

  const updatePickupAddressMutation = useMutation({
    mutationKey: ['update-pickup-address'],
    mutationFn: updatePickupAddress,
  });

  return { updatePickupAddressMutation };
};

export default usePickupAddress;
