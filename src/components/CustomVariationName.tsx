import { useRef } from 'react';
import { IonItem, IonInput } from '@ionic/react';

const CustomVariationName: React.FC<{
  variationKey: string;
  name: string;
  setName: Function;
  addVariation: Function;
}> = ({ variationKey = '', name, setName, addVariation }) => {
  const prevNameRef = useRef('');

  const handleInput = (ev: Event) => {
    let value = '';
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) value = target.value!.toLowerCase();
    setName(value);
  };

  const handleAddVariation = () => {
    addVariation(name, variationKey);
    prevNameRef.current = name;
  };

  return (
    <IonItem>
      <IonInput
        label='Variation'
        labelPlacement='floating'
        placeholder='E.g material'
        value={name}
        onIonInput={handleInput}
        onBlur={handleAddVariation}
        debounce={200}
      />
    </IonItem>
  );
};

export default CustomVariationName;
