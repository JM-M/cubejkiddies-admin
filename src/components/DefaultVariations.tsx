import { IonList } from '@ionic/react';
import { Control } from 'react-hook-form';
import { InferType } from 'yup';

import ColorSelector from './ColorSelector';
import SizeInput from './SizeInput';
import productSchema from '../constants/schemas/product';

type Product = InferType<typeof productSchema>;

const DefaultVariations: React.FC<{
  control: Control<any, any>;
}> = ({ control }) => {
  return (
    <IonList>
      <ColorSelector control={control} />
      <SizeInput control={control} />
    </IonList>
  );
};

export default DefaultVariations;
