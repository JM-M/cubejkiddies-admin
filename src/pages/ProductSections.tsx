import { IonButton, IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import Page from '../components/Page';
import ProductSectionList from '../components/ProductSectionList';

const ProductSections = () => {
  return (
    <Page title='Product sections'>
      <IonButton
        routerLink='/home-product-sections/new'
        fill='outline'
        className='flex w-fit ml-auto'
      >
        <IonIcon icon={addOutline} className='h-[20px] w-[20px] mr-2' />
        New product section
      </IonButton>
      <ProductSectionList />
    </Page>
  );
};

export default ProductSections;
