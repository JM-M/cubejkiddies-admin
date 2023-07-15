import { useState } from 'react';
import { IonButton, IonIcon, IonItem, IonInput } from '@ionic/react';
import { addOutline } from 'ionicons/icons';

const CustomVariationOptions: React.FC<{
  variationOptions: { name: string; hex?: string }[];
  name: string;
  addVariationOption: Function;
}> = ({ name, addVariationOption, variationOptions = [] }) => {
  const [inputtedOption, setInputtedOption] = useState<string>('');

  const handleInput = (ev: Event) => {
    let value = '';
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) value = target.value!.toLowerCase();
    setInputtedOption(value);
  };

  const handleAddVariationOption = () => {
    const isPresent = variationOptions
      .map(({ name }) => name)
      .includes(inputtedOption);
    if (isPresent) return;
    addVariationOption(name, inputtedOption);
    setInputtedOption('');
  };

  const handleKeyDown = (ev: any) => {
    if (ev.key !== 'Enter') return;
    handleAddVariationOption();
  };

  return (
    <IonItem>
      <IonInput
        placeholder='Option e.g cotton'
        value={inputtedOption}
        onIonInput={handleInput}
        onKeyDown={handleKeyDown}
        disabled={!name}
      />
      {inputtedOption && (
        <IonButton
          type='button'
          fill='outline'
          className='h-8'
          onClick={handleAddVariationOption}
        >
          <IonIcon
            icon={addOutline}
            slot='start'
            className='h-[20px] w-[20px]'
          />
          Add
        </IonButton>
      )}
    </IonItem>
  );
};

export default CustomVariationOptions;
