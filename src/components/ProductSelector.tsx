import { useState } from 'react';
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
} from '@ionic/react';
import { addOutline, closeOutline, pencilOutline } from 'ionicons/icons';
import ProductsDisplay from './ProductsDisplay';
import { Product } from '../constants/schemas/product';
import ProductGrid from './ProductGrid';

interface Props {
  onSelectionChange?: (selection: boolean, product: Product) => any;
  initialSelection?: Product[];
  error?: any;
}

const ProductSelector = (props: Props) => {
  const { error, initialSelection: selectedProducts = [] } = props;
  const [open, setOpen] = useState<boolean>(false);

  const openModal = () => setOpen(true);

  const closeModal = () => setOpen(false);

  const hasSelectedProducts = !!selectedProducts.length;

  return (
    <>
      <IonModal isOpen={open}>
        <IonHeader className='ion-no-border'>
          <IonToolbar>
            <IonButtons slot='start'>
              <IonButton
                className='rounded-3xl overflow-hidden'
                onClick={closeModal}
              >
                <IonIcon
                  icon={closeOutline}
                  className='block h-[30px] w-w[30px]'
                />
              </IonButton>
            </IonButtons>
            <IonTitle>Select products</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className='ion-no-padding'>
          <div className='container py-5 min-h-full'>
            <ProductsDisplay
              {...props}
              initialSelection={selectedProducts}
              selectable
            />
            <IonButton
              fill='solid'
              className='flex w-fit ml-auto'
              onClick={closeModal}
            >
              Done
            </IonButton>
          </div>
        </IonContent>
      </IonModal>
      <div className='my-5'>
        {hasSelectedProducts ? (
          <ProductGrid products={selectedProducts} />
        ) : (
          <span className='text-gray-500'>No products selected</span>
        )}
      </div>
      <div className='mt-10'>
        <IonButton
          fill='outline'
          className='flex w-fit ml-auto'
          onClick={openModal}
        >
          <IonIcon
            icon={hasSelectedProducts ? pencilOutline : addOutline}
            className='h-[20px] w-[20px] mr-2'
          />
          {hasSelectedProducts ? 'Edit' : 'Add'} products
        </IonButton>
      </div>
      {error && (
        <IonText
          color='danger'
          slot='end'
          className='block mt-2 pt-1 text-left text-xs border-t border-[var(--ion-color-danger)]'
        >
          {error?.message}
        </IonText>
      )}
    </>
  );
};

export default ProductSelector;
