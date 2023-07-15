import { IonList, IonButton, IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';

import Variation from './Variation';

type Variation = { name: string; options: string[]; id: string };

const defaultVariations = ['color', 'sizes'];

const CustomVariations: React.FC<{
  variations: any;
  setValue: any;
  unregister: any;
  watch: Function;
}> = ({ variations = {}, setValue, unregister, watch }) => {
  const variationKeys = Object.keys(variations);

  const addEmptyVariation = () => {
    setValue('variations._empty', []);
  };

  const addVariation = (variationName: string, oldVariationName: string) => {
    const currentVariations = watch('variations');
    const currentVariationOptions = currentVariations[oldVariationName];
    delete currentVariations[oldVariationName];
    currentVariations[variationName] = currentVariationOptions;
    setValue(`variations`, currentVariations);
  };

  const removeVariation = (variationName: string) => {
    unregister(`variations.${variationName}`);
  };

  const removeVariationOption = (variationName: string, option: string) => {
    const path = `variations.${variationName}`;
    const variation = watch(path).filter(({ name }: any) => name !== option);
    setValue(path, variation);
  };

  const addVariationOption = (variationName: string, option: string) => {
    const currentOptions = watch(`variations.${variationName}`);
    if (!currentOptions.includes(option))
      setValue(`variations.${variationName}`, [
        ...currentOptions,
        { name: option },
      ]);
  };

  return (
    <IonList>
      <ul>
        {variationKeys.map((key) => {
          if (defaultVariations.includes(key)) return null;
          const variationOptions: Variation = variations[key];
          return (
            <li key={key}>
              <Variation
                variationOptions={variationOptions}
                variationKey={key}
                addVariation={addVariation}
                addVariationOption={addVariationOption}
                removeVariation={removeVariation}
                removeVariationOption={removeVariationOption}
              />
            </li>
          );
        })}
      </ul>
      <IonButton
        color='secondary'
        className='block mt-5'
        onClick={addEmptyVariation}
      >
        <IonIcon icon={addOutline} className='h-[20px] w-[20px] mr-2' />
        Add variation
      </IonButton>
    </IonList>
  );
};

export default CustomVariations;
