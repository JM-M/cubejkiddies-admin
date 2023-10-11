import useTerminal from '../hooks/useTerminal';
import Typeahead from './Typeahead';

interface Props {
  name: string;
  label?: string;
  register: any;
  value: string;
  setValue: Function;
  country: string;
  state: string;
  error?: any;
}

type CityOption = { text: string; value: string };

const CitySelector = ({
  name = '',
  label = '',
  register,
  value = '',
  country,
  state,
  setValue,
  error,
}: Props) => {
  const { citiesQuery } = useTerminal({
    countryIsoCode: country,
    stateIsoCode: state,
  });
  const loading = citiesQuery.isLoading;
  const disabled = !country || !state || !citiesQuery.data?.length;

  const cityOptions: CityOption[] =
    loading || !citiesQuery.data?.length
      ? []
      : citiesQuery.data.map(({ name }: { isoCode: string; name: string }) => ({
          value: name,
          text: name,
        }));

  return (
    <Typeahead
      name={name}
      register={register}
      title={label}
      items={cityOptions}
      value={value}
      onSelectionChange={(value) => setValue(value)}
      error={error}
      loading={loading}
      disabled={disabled}
    />
  );
};

export default CitySelector;
