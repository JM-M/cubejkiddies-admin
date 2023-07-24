import PageLoader from './PageLoader';
import useTerminal from '../hooks/useTerminal';

const DeliveryPricesEditor = () => {
  const { statesQuery } = useTerminal({ countryIsoCode: 'NG' });

  if (statesQuery.isLoading) return <PageLoader />;
  if (statesQuery.isError) return <>An error occurred</>;
  if (!statesQuery.data) return <>No states data</>;
  if (!Array.isArray(statesQuery.data)) return <>States data is not an array</>;

  return (
    <ul>
      {statesQuery.data.map((state) => {
        const { isoCode, name } = state;
        return <li key={isoCode}>{name}</li>;
      })}
    </ul>
  );
};

export default DeliveryPricesEditor;
