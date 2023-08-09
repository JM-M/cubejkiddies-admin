import { ReactNode, forwardRef } from 'react';
import { IonButton, IonSpinner } from '@ionic/react';
import { JSX } from '@ionic/core';

type Props = JSX.IonButton & {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  [x: string]: any;
};

const Button = ({ children, loading, disabled, ...props }: Props, ref: any) => {
  return (
    <IonButton ref={ref} {...props} disabled={loading || disabled}>
      {loading && <IonSpinner name='dots' className='inline-block mr-3' />}
      {children}
    </IonButton>
  );
};

export default forwardRef(Button);
