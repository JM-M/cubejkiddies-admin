import { useState } from "react";
import {
  IonModal,
  IonHeader,
  IonButtons,
  IonTitle,
  IonToolbar,
  IonContent,
  IonButton,
  IonIcon,
  IonText,
} from "@ionic/react";
import { addOutline, closeOutline, pencilOutline } from "ionicons/icons";
import cx from "classnames";
import ProductsDisplay from "./ProductsDisplay";
import ProductGrid from "./ProductGrid";
import ErrorText from "./ErrorText";
import { Product } from "../constants/schemas/product";

interface Props {
  onSelectionChange?: (selection: boolean, product: Product) => any;
  initialSelection?: Product[];
  error?: string;
  multiselect?: boolean;
  disabled?: boolean;
}

const ProductSelector = (props: Props) => {
  const {
    error,
    initialSelection: selectedProducts = [],
    multiselect = true,
    disabled = false,
  } = props;
  const [open, setOpen] = useState<boolean>(false);

  const openModal = () => setOpen(true);

  const closeModal = () => setOpen(false);

  const hasSelectedProducts = !!selectedProducts.length;

  return (
    <>
      <IonModal isOpen={!disabled && open}>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton
                className="rounded-3xl overflow-hidden"
                onClick={closeModal}
              >
                <IonIcon
                  icon={closeOutline}
                  className="block h-[30px] w-w[30px]"
                />
              </IonButton>
            </IonButtons>
            <IonTitle>Select products</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-no-padding">
          <div className="container py-5 min-h-full">
            <ProductsDisplay
              {...props}
              initialSelection={selectedProducts}
              multiselect={multiselect}
              selectable
            />
            <IonButton
              fill="solid"
              className="flex w-fit ml-auto"
              onClick={closeModal}
            >
              Done
            </IonButton>
          </div>
        </IonContent>
      </IonModal>
      <div className={cx("my-5", { disabled })}>
        {hasSelectedProducts ? (
          <ProductGrid products={selectedProducts} />
        ) : (
          <span className="text-gray-500">
            No {"product" + (multiselect ? "s" : "")} selected
          </span>
        )}
      </div>
      <div className="mt-10">
        <IonButton
          fill="outline"
          className="flex w-fit ml-auto"
          onClick={openModal}
          disabled={disabled}
        >
          <IonIcon
            icon={hasSelectedProducts ? pencilOutline : addOutline}
            className="h-[20px] w-[20px] mr-2"
          />
          {hasSelectedProducts ? "Edit" : "Add"}{" "}
          {"product" + (multiselect ? "s" : "")}
        </IonButton>
      </div>
      <ErrorText text={error} />
    </>
  );
};

export default ProductSelector;
