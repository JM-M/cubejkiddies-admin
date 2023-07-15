import { useState, useRef, useMemo } from 'react';
import { IonSpinner, useIonRouter } from '@ionic/react';
import { createColumnHelper } from '@tanstack/react-table';
import { IonIcon } from '@ionic/react';
import {
  removeCircleOutline,
  checkmarkCircle,
  ellipseOutline,
} from 'ionicons/icons';

import Table from './Table';
import TableController from './TableController';
import PageLoader from './PageLoader';
import { Product } from '../constants/schemas/product';
import { NAIRA } from '../constants/unicode';

interface Props {
  selectable?: boolean;
  onSelectionChange?: (selection: boolean, product: Product) => any;
  initialSelection?: Product[];
  products: Product[];
  totalPages?: number;
  onPagePrev?: () => void;
  onPageNext?: () => void;
  loading?: boolean;
}

const columnHelper = createColumnHelper<Product>();

const ProductTable = ({
  selectable = false,
  onSelectionChange,
  initialSelection = [],
  products = [],
  totalPages = 0,
  onPageNext = () => null,
  onPagePrev = () => null,
  loading = false,
}: Props) => {
  const [page, setPage] = useState<number>(1);
  const [selectedProducts, setSelectedProducts] =
    useState<Product[]>(initialSelection);

  const onSelectionChangeRef = useRef<Function | undefined>(onSelectionChange);

  const ionRouter = useIonRouter();

  const columns = useMemo(() => {
    const columns = [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (name) => <span className='font-medium'>{name.getValue()}</span>,
      }),
      columnHelper.accessor('price', {
        header: () => <span className='whitespace-nowrap'>Price</span>,
        cell: (price) => (
          <span className='whitespace-nowrap'>
            {NAIRA} {price.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('stocks', {
        header: () => 'Total stock',
        cell: (stocks) =>
          stocks.getValue().reduce((total, stock) => total + stock.quantity, 0),
      }),
    ];
    if (selectable)
      columns.unshift({
        id: 'select',
        header: ({ table }: any) => {
          return (
            <IonIcon
              color='primary'
              icon={removeCircleOutline}
              onClick={() => {
                if (!products?.length) return;
                setSelectedProducts((products: Product[]) => {
                  if (products.length === products.length) return [];
                  return products;
                });
              }}
              className='h-[24px] w-[24px]'
            />
          );
        },
        cell: ({ row }: any) => {
          const selected = selectedProducts
            .map((p) => p.id)
            .includes(row.original.id);
          return (
            <IonIcon
              color='primary'
              icon={selected ? checkmarkCircle : ellipseOutline}
              className='h-[24px] w-[24px]'
            />
          );
        },
      });

    return columns;
  }, [selectable, selectedProducts, products]);

  const goToProduct = (id: string) => {
    ionRouter.push(`/products/${id}/preview`);
  };

  const handleSelection = (product: Product) => {
    if (typeof onSelectionChangeRef.current !== 'function') return;

    const productId = product.id;
    const selectedProductIds = selectedProducts.map((p: Product) => p.id);
    const selected = selectedProductIds.includes(productId);
    if (selected) {
      onSelectionChangeRef.current!(false, product);
      setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
    } else {
      onSelectionChangeRef.current!(true, product);
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const onRowClick = (row: any) => {
    const product = row.original;
    const productId = product?.id;
    if (selectable) {
      handleSelection(product);
      return;
    }
    goToProduct(productId);
  };

  if (loading) return <PageLoader />;

  if (!Array.isArray(products)) return 'Page is not an array';

  if (!products?.length) return 'Page is an empty array';

  return (
    <>
      <div className='flex flex-col min-h-[300px]'>
        {products ? (
          <Table data={products} columns={columns} onRowClick={onRowClick} />
        ) : (
          <span className='m-auto'>
            {loading ? (
              <span className='text-gray-500'>Page not found</span>
            ) : (
              <IonSpinner name='circular' />
            )}
          </span>
        )}
      </div>
      <TableController
        page={page}
        onPageChange={(page) => setPage(page)}
        onPagePrev={onPagePrev}
        onPageNext={onPageNext}
        totalPages={totalPages}
      />
    </>
  );
};

export default ProductTable;
