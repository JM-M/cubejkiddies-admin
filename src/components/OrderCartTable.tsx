import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useIonRouter } from '@ionic/react';
import Table from './Table';
import { ProductWithCartOptions, measureCart } from '../hooks/useCart';
import { NAIRA } from '../constants/unicode';

interface Props {
  products: ProductWithCartOptions[];
  deliveryFee: number;
}

const columnHelper = createColumnHelper<ProductWithCartOptions>();

const OrderCartTable: React.FC<Props> = ({ products = [], deliveryFee }) => {
  const ionRouter = useIonRouter();

  const columns = useMemo(() => {
    return [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (name) => <span className='font-medium'>{name.getValue()}</span>,
        footer: () => (
          <div className='flex flex-col mt-3'>
            <div className='flex items-center justify-start h-7 text-right'>
              <span className='block text-left font-normal'>Subtotal</span>
            </div>
            <div className='flex items-center justify-start h-7 text-right'>
              <span className='block text-left font-normal'>Delivery fee</span>
            </div>
            <div className='flex items-center justify-start h-7 text-right'>
              <span className='block text-left'>Total</span>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('qty', {
        header: 'Quantity',
      }),
    ];
  }, [deliveryFee]);

  const goToOrder = (row: any) => {
    ionRouter.push(`/products/${row.original.id}/preview`);
  };

  const totalCartValue = measureCart(products).totalCartValue;
  const totalFee = Math.round((totalCartValue + deliveryFee) * 100) / 100;

  return (
    <Table
      data={products}
      columns={[
        ...columns,
        columnHelper.accessor('price', {
          header: 'Total Price',
          cell: ({
            row: {
              original: { discount },
            },
            getValue,
          }) => {
            let price = getValue();
            if (discount) price = price - price * (discount / 100);
            return `N ${price}`;
          },
          footer: () => (
            <div className='flex flex-col mt-3'>
              <div className='flex items-center justify-end h-7 text-right font-normal'>
                {NAIRA} {totalCartValue}
              </div>
              <div className='flex items-center justify-end h-7 text-right font-normal'>
                {NAIRA} {deliveryFee}
              </div>
              <div className='flex items-center justify-end h-7 text-right'>
                {NAIRA} {totalFee}
              </div>
            </div>
          ),
        }),
      ]}
      onRowClick={goToOrder}
      hideNavigation
    />
  );
};

export default OrderCartTable;
