import { useState } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { removeOutline, closeOutline } from 'ionicons/icons';

import CustomVariationName from './CustomVariationName';
import CustomVariationOptions from './CustomVariationOptions';

const Variation: React.FC<{
  variationOptions: any;
  variationKey: string;
  addVariation: Function;
  addVariationOption: Function;
  removeVariation: Function;
  removeVariationOption: Function;
}> = ({
  variationOptions = [],
  variationKey = '',
  addVariation,
  addVariationOption,
  removeVariation,
  removeVariationOption,
}) => {
  const [name, setName] = useState(
    variationKey === '_empty' ? '' : variationKey
  );
  return (
    <>
      <CustomVariationName
        variationKey={variationKey}
        name={name}
        setName={setName}
        addVariation={addVariation}
      />
      <div className='py-2 my-3'>
        {!!variationOptions.length ? (
          <ul className='flex items-center flex-wrap gap-3'>
            {variationOptions.map(({ name }: any, index: number) => {
              return (
                <li key={`${name}-${index}`}>
                  <div className='flex items-center flex-wrap gap-2 px-2 py-1 bg-gray-200 rounded-lg capitalize'>
                    {name}
                    <IonIcon
                      icon={closeOutline}
                      className='relative top-[1px] h-[22px] w-[22px]'
                      onClick={() => removeVariationOption(variationKey, name)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <span className='text-gray-500'>No options added</span>
        )}
      </div>
      <CustomVariationOptions
        name={name}
        addVariationOption={addVariationOption}
        variationOptions={variationOptions}
      />
      <IonButton
        type='button'
        fill='outline'
        className='block h-8 w-fit ml-auto mt-5'
        onClick={() => removeVariation(name)}
      >
        <IonIcon
          icon={removeOutline}
          slot='start'
          className='h-[20px] w-[20px]'
        />
        Remove
      </IonButton>
    </>
  );
};

export default Variation;
