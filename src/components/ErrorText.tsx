import { IonText } from '@ionic/react';
import cx from 'classnames';

interface Props {
  className?: string;
  text?: string;
  hideHorizontalBar?: boolean;
}

const ErrorText = ({
  className = '',
  text,
  hideHorizontalBar = false,
}: Props) => {
  if (!text) return <></>;
  return (
    <div
      className={cx(className, {
        'border-t border-[var(--ion-color-danger)]': !hideHorizontalBar,
      })}
    >
      <IonText color='danger' slot='end' className='text-xs'>
        {text}
      </IonText>
    </div>
  );
};

export default ErrorText;
