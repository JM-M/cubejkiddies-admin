import { useState, useMemo } from 'react';
import {
  IonLabel,
  IonList,
  IonSearchbar,
  IonItem,
  IonIcon,
} from '@ionic/react';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { closeOutline, searchOutline } from 'ionicons/icons';

import colors from '../constants/colors';

const ColorSelector: React.FC<{
  control: Control;
}> = ({ control }) => {
  const [inputtedQuery, setInputtedQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variations.colors',
  });

  const selectedColors = useMemo(() => {
    return fields.map(({ name }: any) => name);
  }, [fields]);

  const colorNames = useMemo(() => {
    return Object.keys(colors);
  }, [colors]);

  const handleInput = (ev: Event) => {
    let query = '';
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) query = target.value!.toLowerCase();
    setInputtedQuery(query);
    setSearchResults(
      colorNames.filter(
        (d) =>
          d.toLowerCase().indexOf(query) > -1 && !selectedColors.includes(d)
      )
    );
  };

  const handleBlur = () => setSearchResults([]);

  const selectColor = (color: string) => {
    if (selectedColors.includes(color)) return;
    append({ name: color, hex: colors[color] });
    setInputtedQuery('');
  };

  return (
    <Controller
      control={control}
      name='variations.colors'
      render={({ field: { onBlur, ref }, formState, fieldState }) => {
        return (
          <>
            <IonLabel>Colours</IonLabel>
            <div className='py-2 my-3'>
              {!!fields.length ? (
                <ul className='flex items-center flex-wrap gap-3'>
                  {fields.map(({ name, hex, id }: any, index) => {
                    return (
                      <li key={id}>
                        <div className='flex items-center flex-wrap gap-2 px-2 py-1 bg-gray-200 rounded-lg capitalize'>
                          <span
                            className='inline-block h-4 w-4 rounded-xl'
                            style={{ backgroundColor: hex }}
                          ></span>
                          {name}
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
                <span className='text-gray-500'>No colours selected</span>
              )}
            </div>
            <IonSearchbar
              ref={ref}
              color='light'
              searchIcon={searchOutline}
              slot='end'
              placeholder='Search colors'
              className='p-0 text-left'
              value={inputtedQuery}
              onIonInput={handleInput}
              onIonFocus={handleInput}
              onIonBlur={handleBlur}
              debounce={200}
              onBlur={onBlur}
            />
            <IonList className='max-h-[250px] mt-1 overflow-y-auto'>
              {searchResults.map((colorResult) => (
                <IonItem
                  key={colorResult}
                  onClick={() => selectColor(colorResult)}
                >
                  <span
                    className='inline-block h-5 w-5 mr-3 rounded-xl'
                    style={{ backgroundColor: colors[colorResult] }}
                  ></span>
                  {colorResult}
                </IonItem>
              ))}
            </IonList>
          </>
        );
      }}
    />
  );
};

export default ColorSelector;
