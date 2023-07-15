import { IonButton, IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import Reviews from './Reviews';

const ProductReviews = () => {
  return (
    <div className='container pt-[30px]'>
      <h4 className='mb-[10px] font-medium text-gray-500 text-base'>Reviews</h4>
      <IonButton
        color='secondary'
        className='flex items-center justify-center gap-[10px] h-10 w-full mb-5 rounded-[8px]'
      >
        <IonIcon icon={addOutline} slot='start' className='h-[24px] w-[24px]' />
        Add review
      </IonButton>
      <ul className='flex flex-col gap-5'>
        {[...Array(3)].map((_, i) => (
          <li key={i}>
            <Reviews />
          </li>
        ))}
      </ul>
      <IonButton
        color='sec'
        className='block !h-30 w-fit mx-auto mt-[30px] font-medium rounded-[8px]'
      >
        Load more
      </IonButton>
    </div>
  );
};

export default ProductReviews;
