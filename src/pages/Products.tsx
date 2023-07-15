import { IonButton, IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import ProductsDisplay from '../components/ProductsDisplay';
import Page from '../components/Page';

const Products: React.FC = () => {
  return (
    <Page title='Products'>
      <IonButton
        routerLink='/products/new'
        fill='outline'
        className='flex w-fit ml-auto'
      >
        <IonIcon icon={addOutline} className='h-[20px] w-[20px] mr-2' />
        New product
      </IonButton>
      <ProductsDisplay />
    </Page>
  );
};

export default Products;
