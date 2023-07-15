import { useState } from 'react';
import {
  IonItem,
  IonInput,
  IonButton,
  IonSpinner,
  IonIcon,
} from '@ionic/react';
import { addOutline, closeOutline } from 'ionicons/icons';

interface Props {
  initialValue?: string;
  save: (name: string) => void;
  cancel: () => void;
  saving: boolean;
}

const CategoryInput = ({ initialValue = '', save, cancel, saving }: Props) => {
  const [name, setName] = useState<string>(initialValue);

  const handleInput = (ev: Event) => {
    const target = ev.target as HTMLIonSearchbarElement;
    const value = target.value;
    setName(value as string);
  };

  const handleKeyDown = (ev: any) => {
    if (ev.key !== 'Enter') return;
    save(name);
  };

  return (
    <IonItem className='-ml-[16px]'>
      <IonInput
        placeholder='Category name'
        value={name}
        onIonInput={handleInput}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      {name.trim() ? (
        <IonButton
          type='button'
          fill='outline'
          className='h-8'
          onClick={() => save(name)}
          disabled={saving}
        >
          <IonIcon
            icon={addOutline}
            slot='start'
            className='h-[20px] w-[20px]'
          />
          {saving ? (
            <IonSpinner name='dots' className='inline-block' />
          ) : initialValue ? (
            'save'
          ) : (
            'add'
          )}
        </IonButton>
      ) : (
        <IonButton
          type='button'
          fill='outline'
          className='h-8'
          onClick={() => cancel()}
        >
          <IonIcon
            icon={closeOutline}
            slot='start'
            className='h-[20px] w-[20px]'
          />
          Cancel
        </IonButton>
      )}
    </IonItem>
  );
};

export default CategoryInput;
