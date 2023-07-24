import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type Country = { name: string; isoCode: string };

interface Props {
  countryIsoCode?: string;
  stateIsoCode?: string;
}

const TERMINAL_API_KEY = 'sk_live_ewf13L3iikIiZ1ERRDNcJxWtXcKoSPwq';

const axiosInstance = axios.create({
  baseURL: 'https://api.terminal.africa/v1/',
  headers: {
    Authorization: `Bearer ${TERMINAL_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

const useTerminal = (props: Props = {}) => {
  const { countryIsoCode = 'NG', stateIsoCode = '' } = props;
  const countriesQuery = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('countries');
      if (!data.status) {
        throw new Error(data.message || 'An error occurred');
      }
      return data.data;
    },
    staleTime: Infinity,
  });

  const statesQuery = useQuery({
    queryKey: ['states', countryIsoCode],
    queryFn: async () => {
      const { data } = await axiosInstance.get('states', {
        params: { country_code: countryIsoCode },
      });
      if (!data.status) {
        throw new Error(data.message || 'An error occurred');
      }
      return data.data;
    },
    staleTime: Infinity,
  });

  const citiesQuery = useQuery({
    queryKey: ['cities', countryIsoCode, stateIsoCode],
    queryFn: async () => {
      const { data } = await axiosInstance.get('cities', {
        params: { country_code: countryIsoCode, state_code: stateIsoCode },
      });
      if (!data.status) {
        throw new Error(data.message || 'An error occurred');
      }
      return data.data;
    },
    staleTime: Infinity,
  });

  const getCountryNameFromIsoCode = (isoCode: string) => {
    const countries = countriesQuery.data;
    if (countriesQuery.isLoading || !countries.length) return false;
    return countries.find((country: Country) => country.isoCode === isoCode);
  };

  const getStateNameFromIsoCode = (isoCode: string) => {
    const states = statesQuery.data;
    if (statesQuery.isLoading || !states.length) return false;
    return states.find((state: Country) => state.isoCode === isoCode);
  };

  return {
    countriesQuery,
    statesQuery,
    citiesQuery,
    getCountryNameFromIsoCode,
    getStateNameFromIsoCode,
  };
};

export default useTerminal;
