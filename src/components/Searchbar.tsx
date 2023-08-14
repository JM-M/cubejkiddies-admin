import { useRef, useState } from "react";
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  Hits,
  SearchBoxProps,
} from "react-instantsearch";

const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APPLICATION_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_ONLY_API_KEY
);

const Searchbar: React.FC<
  SearchBoxProps & { indexName: string; hitComponent: React.FC }
> = ({ indexName, hitComponent, ...rest }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [focused, setFocused] = useState<boolean>();

  const ref = useRef<any>();

  return (
    <div ref={ref} className="relative h-fit">
      <InstantSearch searchClient={searchClient} indexName={indexName}>
        <SearchBox
          {...rest}
          onChangeCapture={(e) => setSearchTerm((e.target as any)?.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {focused && searchTerm && <Hits hitComponent={hitComponent} />}
      </InstantSearch>
    </div>
  );
};

export default Searchbar;
