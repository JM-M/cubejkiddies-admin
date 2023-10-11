import { useRef, useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  SearchBox,
  Hits,
  SearchBoxProps,
} from 'react-instantsearch';
import { Product } from '../constants/schemas/product';

const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APPLICATION_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_ONLY_API_KEY
);

type Props = SearchBoxProps & {
  indexName: string;
  hitComponent: any;
  selectable?: boolean;
  onSelectionChange?: (selection: boolean, product: Product) => any;
  initialSelection?: Product[];
  multiselect?: boolean;
};

const Searchbar: React.FC<Props> = ({
  indexName,
  hitComponent,
  selectable = false,
  multiselect = false,
  onSelectionChange,
  initialSelection = [],
  ...rest
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [focused, setFocused] = useState<boolean>();

  const ref = useRef<any>();

  const HitComponent = hitComponent as any;

  return (
    <div ref={ref} className='relative h-fit'>
      <InstantSearch searchClient={searchClient} indexName={indexName}>
        <SearchBox
          {...rest}
          onChangeCapture={(e) => setSearchTerm((e.target as any)?.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {(focused || multiselect) && searchTerm && (
          <Hits
            hitComponent={(props) => {
              const hit = props?.hit || ({} as any);
              const {
                objectID,
                name,
                category,
                image,
                price,
                discount = 0,
              } = hit as any;
              const selected = !!(
                initialSelection?.length &&
                initialSelection.find((product) => product?.id === hit.objectID)
              );
              return (
                <HitComponent
                  {...props}
                  selected={selected}
                  onSelectionChange={(selection: boolean) => {
                    if (typeof onSelectionChange !== 'function') return;
                    const product: any = {
                      name,
                      price,
                      category,
                      stocks: [{ images: [image] }],
                      id: objectID,
                      discount,
                    };
                    onSelectionChange(selection, product);
                  }}
                  selectable={multiselect}
                />
              );
            }}
          />
        )}
      </InstantSearch>
    </div>
  );
};

export default Searchbar;
