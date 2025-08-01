import { IonIcon, useIonRouter } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';

interface Props {
  title: string;
  sectionId: string;
}

const ProductSectionCard = ({
  title = '',
  sectionId
}: Props) => {
  const ionRouter = useIonRouter();

  const goToSection = () => {
    if (!sectionId) return;
    ionRouter.push(`/home-product-sections/${sectionId}/edit`);
  };

  return (
    <div
      className='flex justify-between items-center p-3 bg-[var(--ion-color-light)] rounded-xl'
      onClick={goToSection}
    >
      <div>
        <h3 className='text-lg font-medium'>{title}</h3>
      </div>
      <IonIcon
        icon={chevronForwardOutline}
        color='medium'
        className='h-[24px] w-[24px]'
      />
    </div>
  );
};

export default ProductSectionCard;
