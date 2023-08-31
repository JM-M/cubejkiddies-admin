import { IonButton, IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import Page from '../components/Page';
import ProductSectionList from '../components/ProductSectionList';
import NewProductSectionOptions from '../components/NewProductSectionOptions';

const ProductSections = () => {
  return (
    <Page title='Product sections'>
      <IonButton
        fill='outline'
        className='flex w-fit ml-auto'
        id='custom-product-section'
      >
        <IonIcon icon={addOutline} className='h-[20px] w-[20px] mr-2' />
        New product section
      </IonButton>
      <NewProductSectionOptions />
      <ProductSectionList />
    </Page>
  );
};

export default ProductSections;
