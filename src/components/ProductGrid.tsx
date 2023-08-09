import { IonButton, IonSpinner } from "@ionic/react";
import ProductCard from "./ProductCard";
import PageLoader from "./PageLoader";
import { SortOption } from "../hooks/useProducts";
import { Product } from "../constants/schemas/product";

interface Props {
  sortBy?: SortOption;
  selectable?: boolean;
  onSelectionChange?: (selection: boolean, product: Product) => any;
  initialSelection?: Product[];
  products?: Product[];
  initialLoading?: boolean;
  onLoadMore?: Function;
  loadingMore?: boolean;
  hasMore?: boolean;
  multiselect?: boolean;
}

const ProductGrid = ({
  selectable,
  onSelectionChange,
  initialSelection,
  products = [],
  initialLoading = false,
  onLoadMore = () => null,
  loadingMore = false,
  hasMore = false,
  multiselect = true,
}: Props) => {
  if (initialLoading) return <PageLoader />;

  return (
    <>
      <ul className="grid grid-cols-2 gap-5">
        {products.map((product: Product, i: number) => {
          const selected = !!(
            initialSelection?.length &&
            initialSelection.find(({ id }) => id === product.id)
          );
          return (
            <li key={i}>
              <ProductCard
                product={product}
                selected={selected}
                controlled={!multiselect}
                selectable={selectable}
                onSelectionChange={(selection) =>
                  typeof onSelectionChange === "function" &&
                  onSelectionChange(selection, product)
                }
              />
            </li>
          );
        })}
      </ul>
      {hasMore && (
        <IonButton
          color="secondary"
          className="block w-fit mx-auto my-5"
          onClick={() => onLoadMore()}
        >
          {loadingMore ? (
            <>
              <IonSpinner name="dots" className="inline-block" /> Loading...
            </>
          ) : (
            "Load more"
          )}
        </IonButton>
      )}
    </>
  );
};

export default ProductGrid;
