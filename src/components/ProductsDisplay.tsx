import { useEffect, useState } from 'react';
import { listOutline, gridOutline } from 'ionicons/icons';
import DisplayController from './DisplayController';
import QueryController from './QueryController';
import ProductTable from './ProductTable';
import ProductGrid from './ProductGrid';
import Searchbar from './Searchbar';
import ProductSearchHit from './ProductSearchHit';
import useProducts, { SortOption } from '../hooks/useProducts';
import { Product } from '../constants/schemas/product';

const SORT_OPTIONS: { [option: string]: SortOption } = {
  'A - Z': { field: 'name', reverse: false },
  'Z - A': { field: 'name', reverse: true },
  Newest: { field: 'createdAt', reverse: false },
  Oldest: { field: 'createdAt', reverse: true },
};

interface Props {
  selectable?: boolean;
  onSelectionChange?: (selection: boolean, product: Product) => any;
  initialSelection?: Product[];
  multiselect?: boolean;
}

const ProductsDisplay = ({ multiselect = true, ...props }: Props) => {
  const [pageNum, setPageNum] = useState<number>(1);
  const [display, setDisplay] = useState<'list' | 'grid'>('list');
  const [sortOption, setSortOption] = useState<string>();

  const displayOptions = {
    list: listOutline,
    grid: gridOutline,
  };

  const sortBy = sortOption ? SORT_OPTIONS[sortOption] : undefined;

  const { productsQuery } = useProducts({ sortBy });
  const {
    data = {},
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = productsQuery;
  const { allDocs = [], totalPages, pages = [] } = data as any;
  const pageProducts = pages[pageNum - 1]?.docs;

  const onTableNext = () => {
    if (!pages || !hasNextPage || pageNum >= totalPages) return;
    const nextPage = pageNum + 1;
    if (nextPage > pages?.length) fetchNextPage();
    setPageNum(nextPage);
  };

  const onTablePrev = () => {
    if (pageNum > 1) setPageNum(pageNum - 1);
  };

  let products;
  switch (display) {
    case 'grid':
      products = (
        <ProductGrid
          products={allDocs}
          initialLoading={isLoading}
          onLoadMore={fetchNextPage}
          loadingMore={isFetching}
          hasMore={hasNextPage}
          sortBy={sortBy}
          multiselect={multiselect}
          {...props}
        />
      );
      break;
    default:
      products = (
        <ProductTable
          products={pageProducts}
          onPageNext={onTableNext}
          onPagePrev={onTablePrev}
          totalPages={totalPages}
          loading={isLoading || (!pageProducts && isFetching)}
          multiselect={multiselect}
          {...props}
        />
      );
      break;
  }
  return (
    <>
      <div className='rounded-lg overflow-visible'>
        <Searchbar
          indexName='products'
          hitComponent={ProductSearchHit}
          placeholder='Search products'
          multiselect={multiselect}
          onSelectionChange={props.onSelectionChange}
          {...props}
        />
      </div>
      <div className='flex justify-between my-5'>
        <DisplayController
          options={displayOptions}
          display={display}
          setDisplay={setDisplay}
        />
        <QueryController
          onSort={setSortOption}
          sortOptions={Object.keys(SORT_OPTIONS)}
        />
      </div>
      {products}
    </>
  );
};

export default ProductsDisplay;
