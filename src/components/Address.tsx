import PageLoader from "./PageLoader";
import { CheckoutAddress } from "../hooks/useCart";
import useTerminal from "../hooks/useTerminal";

const Address: React.FC<CheckoutAddress> = ({
  streetAddress,
  additionalDetails,
  city,
  state,
  country,
}) => {
  const {
    getCountryFromIsoCode,
    getStateFromIsoCode,
    countriesQuery,
    statesQuery,
  } = useTerminal();

  if (countriesQuery.isLoading || statesQuery.isLoading) return <PageLoader />;

  return (
    <div>
      <div>{streetAddress}</div>
      {!!additionalDetails && <div>{additionalDetails}</div>}
      <div>{city}</div>
      <div>{getStateFromIsoCode(state)?.name}</div>
      <div>{getCountryFromIsoCode(country)?.name}</div>
    </div>
  );
};

export default Address;
