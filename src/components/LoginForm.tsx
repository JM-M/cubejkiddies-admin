// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../../firebase';
import { IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';

const LoginForm = () => {
  const onSubmit = (e: any) => {
    e.preventDefault();
    console.log(e);
    // signInWithEmailAndPassword(auth, email, password)
    //   .then((userCredential) => {
    //     // Signed in
    //     const user = userCredential.user;
    //     // ...
    //   })
    //   .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //   });
  };

  return (
    <form onSubmit={onSubmit}>
      <h2 className='mb-10 font-medium text-lg text-center'>Login</h2>
      <IonItem>
        <IonLabel position='floating'>Email</IonLabel>
        <IonInput type='email' aria-label='Email' />
      </IonItem>
      <IonItem>
        <IonLabel position='floating'>Password</IonLabel>
        <IonInput aria-label='First name' type='password' />
      </IonItem>
      <div className='flex justify-end mt-1'>
        <span className='font-medium text-[var(--ion-color-medium)]'>
          Forgot password?
        </span>
      </div>
      <IonButton
        id='checkoutFormButton'
        className='h-[50px] mt-[30px]'
        type='submit'
        expand='block'
      >
        Log in
      </IonButton>
    </form>
  );
};

export default LoginForm;
