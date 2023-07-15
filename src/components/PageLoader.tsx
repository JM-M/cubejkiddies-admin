import { IonSpinner } from '@ionic/react';

const PageLoader = () => {
  return (
    <span className='block m-auto'>
      <IonSpinner
        name='circular'
        color='primary'
        className='h-[30px] w-[30px]'
      />
    </span>
  );
};

export default PageLoader;
