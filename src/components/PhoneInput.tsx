import { forwardRef } from "react";
import { IonItem, IonLabel } from "@ionic/react";
import { Control } from "react-hook-form/dist/types/form";
import { Controller } from "react-hook-form";
import cx from "classnames";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ErrorText from "./ErrorText";

interface Props {
  onChange?: Function;
  label?: string;
  control: Control;
  name: string;
}

const PhoneInput = (props: Props & any, ref: unknown) => {
  const { label, control, name } = props;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const errorText = error?.message;
        return (
          <>
            <IonItem
              className={cx("!overflow-visible", {
                "ion-invalid": !!errorText,
                "ion-valid": !errorText,
              })}
            >
              <IonLabel position="stacked">{label}</IonLabel>
              <ReactPhoneInput {...field} country={"ng"} />
            </IonItem>
            <ErrorText text={errorText} />
          </>
        );
      }}
    />
  );
};

export default forwardRef(PhoneInput);
