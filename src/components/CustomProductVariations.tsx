import { IonItem, IonSelect, IonSelectOption } from "@ionic/react";

const CustomProductVariations: React.FC<{
  variations: any;
  setProductVariant: Function;
}> = ({ variations = {}, setProductVariant = () => null }) => {
  const keys = Object.keys(variations);

  if (!keys.length) return null;

  return (
    <div className="pt-[30px]">
      {keys.map((key, index) => {
        const options = variations[key];

        return (
          <div key={index} className="flex-1 max-w-[50%]">
            <IonItem>
              <IonSelect
                label={key}
                labelPlacement="floating"
                aria-label={key}
                placeholder="Select"
                onIonChange={(ev) => setProductVariant(key, ev.detail.value)}
              >
                {options.map((option: any, i: number) => {
                  const { name } = option;
                  return (
                    <IonSelectOption key={i} value={name}>
                      <IonItem>{name}</IonItem>
                    </IonSelectOption>
                  );
                })}
              </IonSelect>
            </IonItem>
          </div>
        );
      })}
    </div>
  );
};

export default CustomProductVariations;
