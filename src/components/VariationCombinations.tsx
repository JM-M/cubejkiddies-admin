import { IonButton, IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { Control } from 'react-hook-form/dist/types';
import { useFieldArray } from 'react-hook-form';
import VariationCombination from './VariationCombination';

const VariationCombinations: React.FC<{
  register: any;
  setValue: Function;
  control: Control<any, any>;
  variations: any;
  watch: any;
  errors: any;
}> = ({ register, setValue, control, variations, watch, errors = {} }) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'stocks' });

  const addImage = () => append({ variationCombinations: {} });

  return (
    <div>
      <ul className='my-5'>
        {fields.map((field, index) => {
          return (
            <li key={field.id}>
              <VariationCombination
                register={register}
                setValue={setValue}
                index={index}
                remove={remove}
                variations={variations}
                watch={watch}
                error={errors[index]}
              />
            </li>
          );
        })}
      </ul>
      {/* <IonButton fill='clear' className='block mb-5'>
        See all images
      </IonButton> */}
      <IonButton color='secondary' className='block' onClick={addImage}>
        <IonIcon icon={addOutline} className='h-[20px] w-[20px] mr-2' />
        Add stock
      </IonButton>
    </div>
  );
};

export default VariationCombinations;
