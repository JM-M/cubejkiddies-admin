type DeliveryPrice = {
  stateIsoCode: string;
  price: number;
  countryIsoCode: string;
};

interface Props {
  deliveryPrices: any[];
}

const DeliveryPricesTable = () => {
  return <div>DeliveryPricesTable</div>;
};

export default DeliveryPricesTable;
