import {
  IonItem,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonInput,
  IonText,
} from "@ionic/react";
import { removeOutline } from "ionicons/icons";
import cx from "classnames";

import ProductImages from "./ProductImages";

const VariationCombination: React.FC<{
  register: any;
  setValue: Function;
  index: number;
  remove: Function;
  variations: any;
  watch: any;
  error: any;
}> = ({ register, setValue, index, remove, variations, watch, error = {} }) => {
  return (
    <div className="mb-8">
      <div className="flex items-start gap-3 mb-5">
        <span>{index + 1}</span>
        <ProductImages
          onChange={(images: any) => setValue(`stocks.${index}.images`, images)}
          index={index}
          images={watch(`stocks.${index}.images`)}
          setValue={setValue}
        />
        <ul className="flex-1 flex flex-col gap-1">
          {variations &&
            Object.keys(variations).map((key, i) => {
              const variationOptions = variations[key];
              if (!variationOptions || !variationOptions?.length) return null;
              return (
                <li key={i}>
                  <IonItem>
                    <IonSelect
                      interface="action-sheet"
                      label={key}
                      labelPlacement="floating"
                      aria-label={key}
                      placeholder={key}
                      {...register(
                        `stocks.${index}.variationCombination.${key}`
                      )}
                    >
                      {variationOptions.map((option: any, i: number) => {
                        const value = option.name;
                        return (
                          <IonSelectOption
                            key={i}
                            value={value}
                            className={cx({ uppercase: key === "sizes" })}
                          >
                            {value}
                          </IonSelectOption>
                        );
                      })}
                    </IonSelect>
                    {error[`variationCombination.${key}`] && (
                      <IonText color="danger" slot="end" className="text-xs">
                        {error[`variationCombination.${key}`]?.message}
                      </IonText>
                    )}
                  </IonItem>
                </li>
              );
            })}
          <li>
            <IonItem
              className={cx({
                "ion-invalid": !!error?.quantity,
                "ion-valid": !error?.quantity,
              })}
            >
              <IonInput
                type="number"
                label="Stock"
                labelPlacement="floating"
                {...register(`stocks.${index}.quantity`)}
                errorText={error?.quantity?.message}
              />
            </IonItem>
          </li>
        </ul>
      </div>
      <IonButton
        type="button"
        fill="outline"
        className="block h-8 w-fit ml-auto"
        onClick={() => remove(index)}
      >
        <IonIcon
          icon={removeOutline}
          slot="start"
          className="h-[20px] w-[20px]"
        />
        remove
      </IonButton>
    </div>
  );
};

export default VariationCombination;
