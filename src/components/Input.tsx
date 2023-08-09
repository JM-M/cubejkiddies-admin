import { forwardRef, useState } from "react";
import { IonItem, IonInput, IonIcon } from "@ionic/react";
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import cx from "classnames";

interface Props {
  onChange?: Function;
  errorText?: string;
  label?: string;
}

const Input = (props: Props & any, ref: unknown) => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const doNothing = () => null;
  const { onChange = doNothing, errorText, type = "text" } = props;

  const togglePasswordVisibility = () => setPasswordVisible((v) => !v);

  const isPassword = type === "password";

  return (
    <IonItem
      className={cx({
        "ion-invalid": !!errorText,
        "ion-valid": !errorText,
      })}
    >
      <IonInput
        ref={ref}
        {...props}
        type={passwordVisible ? "text" : type}
        onIonInput={onChange}
      />
      {isPassword && (
        <IonIcon
          icon={passwordVisible ? eyeOffOutline : eyeOutline}
          className="h-[20px] w-[20px] mt-auto mb-2"
          onClick={togglePasswordVisibility}
        />
      )}
    </IonItem>
  );
};

export default forwardRef(Input);
