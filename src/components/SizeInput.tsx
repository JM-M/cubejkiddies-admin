import { useState, useMemo } from 'react';
import { IonLabel, IonItem, IonInput, IonButton, IonIcon } from '@ionic/react';
import {
  closeOutline,
  addOutline,
  arrowUpOutline,
  arrowDownOutline,
} from 'ionicons/icons';
import cx from 'classnames';
import { Control, Controller, useFieldArray } from 'react-hook-form';

const SizeInput: React.FC<{
  control: Control;
}> = ({ control }) => {
  const [inputtedSize, setInputtedSize] = useState<string>('');

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'variations.sizes',
  });

  const sizes = useMemo(() => {
    return fields.map(({ name }: any) => name);
  }, [fields]);

  const handleInput = (ev: Event) => {
    let value = '';
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) value = target.value!.toLowerCase();
    setInputtedSize(value);
  };

  const handleKeyDown = (ev: any) => {
    if (ev.key !== 'Enter') return;
    addSize();
  };

  const addSize = () => {
    if (!inputtedSize || sizes.includes(inputtedSize)) return;
    append({ name: inputtedSize.toLowerCase() });
    setInputtedSize('');
  };

  const moveUp = (size: string) => {
    const index = sizes.indexOf(size);
    if (index < 1) return;
    move(index, index - 1);
  };

  const moveDown = (size: string) => {
    const index = sizes.indexOf(size);
    if (index >= sizes.length - 1) return;
    move(index, index + 1);
  };

  return (
    <Controller
      control={control}
      name='variations.sizes'
      render={({ field: { onBlur, ref }, formState, fieldState }) => {
        return (
          <>
            <IonLabel>Sizes</IonLabel>
            <div className='py-2'>
              {!!fields.length ? (
                <ul className='uppercase'>
                  {fields.map(({ name, id }: any, index) => {
                    return (
                      <li key={id}>
                        <div className='flex items-center gap-3 h-10'>
                          <span>{index + 1}</span>
                          {name}
                          <span className='flex gap-3 ml-auto'>
                            <IonIcon
                              icon={arrowUpOutline}
                              className={cx({
                                'pointer-events-none opacity-30': index <= 0,
                              })}
                              onClick={() => moveUp(name)}
                            />
                            <IonIcon
                              icon={arrowDownOutline}
                              className={cx({
                                'pointer-events-none opacity-30':
                                  index >= fields.length - 1,
                              })}
                              onClick={() => moveDown(name)}
                            />
                          </span>
                          <IonIcon
                            icon={closeOutline}
                            className='relative top-[1px] h-[22px] w-[22px]'
                            onClick={() => remove(index)}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <span className='text-gray-500'>No sizes selected</span>
              )}
            </div>
            <IonItem>
              <IonInput
                ref={ref}
                placeholder='Input size'
                value={inputtedSize}
                onIonInput={handleInput}
                onKeyDown={handleKeyDown}
                className={inputtedSize && 'uppercase'}
                onBlur={onBlur}
              />
              {inputtedSize.trim() && (
                <IonButton
                  type='button'
                  fill='outline'
                  className='h-8'
                  onClick={addSize}
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
          </>
        );
      }}
    />
  );
};

export default SizeInput;
