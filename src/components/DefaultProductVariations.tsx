import { IonItem, IonSelect, IonSelectOption } from '@ionic/react';

const DefaultProductVariations: React.FC<{
  colors: any[];
  sizes: any[];
  setProductVariant: Function;
}> = ({ colors, sizes, setProductVariant = () => null }) => {
  return (
    <div className='flex'>
      {!!colors.length && (
        <div className='flex-1 max-w-[50%]'>
          <IonItem>
            <IonSelect
              label='Colors'
              labelPlacement='floating'
              aria-label='Colors'
              placeholder='Select'
              onIonChange={(ev) => setProductVariant('colors', ev.detail.value)}
            >
              {colors.map((color: any, i: number) => {
                const { name, hex } = color;
                return (
                  <IonSelectOption key={name} value={name}>
                    <IonItem>
                      <span
                        className='inline-block h-5 w-5 mr-3 rounded-xl'
                        style={{ backgroundColor: hex }}
                      ></span>
                      {name}
                    </IonItem>
                  </IonSelectOption>
                );
              })}
            </IonSelect>
          </IonItem>
        </div>
      )}
      {!!sizes.length && (
        <div className='flex-1 max-w-[50%]'>
          <IonItem>
            <IonSelect
              label='Sizes'
              labelPlacement='floating'
              aria-label='Sizes'
              placeholder='Select'
              onIonChange={(ev) => setProductVariant('sizes', ev.detail.value)}
            >
              {sizes.map((size: any, i: number) => {
                const { name } = size;
                return (
                  <IonSelectOption key={name} value={name}>
                    {name}
                  </IonSelectOption>
                );
              })}
            </IonSelect>
          </IonItem>
        </div>
      )}
    </div>
  );
};

export default DefaultProductVariations;
