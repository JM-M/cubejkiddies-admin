import { Link } from "react-router-dom";
import { IonButton, IonSpinner } from "@ionic/react";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "./Input";
import ErrorText from "./ErrorText";
import { UserLogin } from "../constants/schemas/auth";
import { userLoginSchema } from "../constants/schemas/auth";
import useFirebaseErrorMessage from "../hooks/useFirebaseErrorMessage";
import useAuthModal from "../hooks/useAuthModal";
import useAuth from "../hooks/useAuth";

const LoginForm = () => {
  const { openAuthModal, closeAuthModal } = useAuthModal();
  const { login, loginMutation } = useAuth();
  const errorMessage = useFirebaseErrorMessage(
    (loginMutation.error as any)?.code
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(userLoginSchema) });

  const submit = (values: UserLogin) => {
    login(values);
  };

  const logginIn = loginMutation.isLoading;

  return (
    <div className="container flex flex-col justify-center min-h-[calc(100vh_-_56px)] py-10">
      <form onSubmit={handleSubmit(submit)}>
        <h2 className="mb-10 font-medium text-lg text-center">
          Login to CubeJKiddies
        </h2>
        <IonButton fill="outline" color="medium" className="block h-10 mb-5">
          <span className="flex items-center justify-center gap-[10px]">
            <FcGoogle size={24} /> Log in with Google
          </span>
        </IonButton>
        <div className="text-xs text-[var(--ion-color-medium)] text-center">
          Or with email and password
        </div>
        <Input
          label="Email"
          labelPlacement="floating"
          {...register("email")}
          errorText={errors.email?.message}
        />
        <Input
          type="password"
          label="Password"
          labelPlacement="floating"
          {...register("password")}
          errorText={errors.password?.message}
        />
        <div className="flex justify-end mt-1">
          <Link
            to="/forgot-password"
            className="font-medium text-[var(--ion-color-primary)]"
            onClick={closeAuthModal}
          >
            Forgot password?
          </Link>
        </div>
        <IonButton
          id="checkoutFormButton"
          className="h-[50px] mt-[30px]"
          type="submit"
          expand="block"
          disabled={logginIn}
        >
          {logginIn && <IonSpinner name="dots" className="inline-block mr-3" />}
          Log in
        </IonButton>
        {errorMessage && (
          <div className="my-5 text-center">
            <ErrorText text={errorMessage} hideHorizontalBar />
          </div>
        )}
      </form>
      <div className="mt-10 text-center text-[var(--ion-color-medium)]">
        New to CubeJKiddies?{" "}
        <span
          className="text-[var(--ion-color-primary)] font-medium"
          onClick={() => openAuthModal("sign-up")}
        >
          Create account
        </span>
      </div>
    </div>
  );
};

export default LoginForm;
