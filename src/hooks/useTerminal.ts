import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCountries,
  getStates,
  getCities,
  createAddress,
  setDefaultSenderAddress,
  getDefaultSenderAddress,
  updateAddress,
} from '../utils/terminal';

type Country = { name: string; isoCode: string };

interface Props {
  countryIsoCode?: string;
  stateIsoCode?: string;
}

const useTerminal = (props: Props = {}) => {
  const { countryIsoCode = 'NG', stateIsoCode = '' } = props;

  const queryClient = useQueryClient();

  const countriesQuery = useQuery({
    queryKey: ['terminal-countries'],
    queryFn: getCountries,
    staleTime: Infinity,
  });

  const statesQuery = useQuery({
    queryKey: ['terminal-states', countryIsoCode],
    queryFn: async () => {
      const res = await getStates({ country_code: countryIsoCode });
      return res;
    },
    staleTime: Infinity,
  });

  const citiesQuery = useQuery({
    queryKey: ['terminal-cities', countryIsoCode, stateIsoCode],
    queryFn: async () => {
      const res = await getCities({
        country_code: countryIsoCode,
        state_code: stateIsoCode,
      });
      return res;
    },
    staleTime: Infinity,
  });

  const defaultSenderAddressQuery = useQuery({
    queryKey: ['terminal-get-default-sender-address'],
    queryFn: async () => {
      try {
        const res = await getDefaultSenderAddress();
        return res;
      } catch (error) {
        return null;
      }
    },
    staleTime: Infinity,
  });
  const defaultSenderAddress = defaultSenderAddressQuery.data;

  const defaultSenderAddressMutation = useMutation({
    mutationKey: ['terminal-set-default-sender-address'],
    mutationFn: async (addressData: any) => {
      if (defaultSenderAddressQuery.isLoading) return;
      if (!defaultSenderAddress) {
        const address = await createAddress(addressData);
        await setDefaultSenderAddress(address.address_id);
      } else {
        await updateAddress({
          data: addressData,
          id: defaultSenderAddress!.address_id,
        });
      }
      return 'success';
    },
    onSuccess: () => {
      if (!defaultSenderAddress)
        queryClient.invalidateQueries(['terminal-get-default-sender-address']);
    },
  });

  const getCountryFromIsoCode = (isoCode: string) => {
    const countries = countriesQuery.data;
    if (countriesQuery.isLoading || !countries.length) return false;
    return countries.find((country: Country) => country.isoCode === isoCode);
  };

  const getStateFromIsoCode = (isoCode: string) => {
    const states = statesQuery.data;
    if (statesQuery.isLoading || !states.length) return false;
    return states.find((state: Country) => state.isoCode === isoCode);
  };

  const getStateFromName = (name: string) => {
    const states = statesQuery.data;
    if (statesQuery.isLoading || !states.length) return false;
    return states.find((state: Country) => state.name === name);
  };

  return {
    countriesQuery,
    statesQuery,
    citiesQuery,
    getCountryFromIsoCode,
    getStateFromIsoCode,
    getStateFromName,
    defaultSenderAddressMutation,
    defaultSenderAddressQuery,
    defaultSenderAddress,
  };
};

export default useTerminal;
