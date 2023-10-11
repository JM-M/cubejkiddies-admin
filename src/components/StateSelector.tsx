import useTerminal from '../hooks/useTerminal';
import Typeahead from './Typeahead';

interface Props {
  name: string;
  label?: string;
  register: any;
  value: string;
  setValue: Function;
  country: string;
  error?: any;
}

type StateOption = { text: string; value: string };

const StateSelector = ({
  name = '',
  label = '',
  register,
  value = '',
  country,
  setValue,
  error,
}: Props) => {
  const { statesQuery } = useTerminal({
    countryIsoCode: country,
  });
  const loading = statesQuery.isLoading;
  const disabled = !country || !statesQuery.data?.length;

  const stateOptions: StateOption[] = loading
    ? []
    : statesQuery.data.map(
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
      items={stateOptions}
      value={value}
      onSelectionChange={(value) => setValue(value)}
      error={error}
      loading={loading}
      disabled={disabled}
    />
  );
};

export default StateSelector;
