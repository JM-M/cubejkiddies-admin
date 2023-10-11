import Typeahead from './Typeahead';
import useTerminal from '../hooks/useTerminal';

interface Props {
  name: string;
  label?: string;
  register: any;
  value: string;
  setValue: Function;
  error?: any;
}

type CountryOption = { text: string; value: string };

const CountrySelector = ({
  name = '',
  label = '',
  register,
  value = '',
  setValue,
  error,
}: Props) => {
  const { countriesQuery } = useTerminal();
  const loading = countriesQuery.isLoading;
  const disabled = !countriesQuery.data?.length;

  const countryOptions: CountryOption[] = loading
    ? []
    : countriesQuery.data.map(
        ({
          isoCode: value,
          name: text,
        }: {
          isoCode: string;
          name: string;
        }) => ({ value, text })
      );

  return (
    <Typeahead
      name={name}
      register={register}
      title={label}
      items={countryOptions}
      value={value}
      onSelectionChange={(value) => setValue(value)}
      error={error}
      loading={loading}
      disabled={disabled}
    />
  );
};

export default CountrySelector;
