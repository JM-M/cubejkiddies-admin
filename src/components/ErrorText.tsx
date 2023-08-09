import { IonText } from "@ionic/react";
import cx from "classnames";

interface Props {
  text?: string;
  hideHorizontalBar?: boolean;
}

const ErrorText = ({ text, hideHorizontalBar = false }: Props) => {
  if (!text) return <></>;
  return (
    <div
      className={cx({
        "border-t border-[var(--ion-color-danger)]": !hideHorizontalBar,
      })}
    >
      <IonText color="danger" slot="end" className="text-xs">
        {text}
      </IonText>
    </div>
  );
};

export default ErrorText;
