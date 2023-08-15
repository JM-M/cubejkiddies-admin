import { IonItem, IonLabel, IonInput, IonButton } from "@ionic/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "./Input";
import Button from "./Button";
import ErrorText from "./ErrorText";
import { adminLoginSchema, AdminLogin } from "../constants/schemas/auth";
import useAuth from "../hooks/useAuth";
import useFirebaseErrorMessage from "../hooks/useFirebaseErrorMessage";

const LoginForm = () => {
  const { login, loginMutation } = useAuth();
  const errorMessage = useFirebaseErrorMessage(
    (loginMutation.error as any)?.code
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(adminLoginSchema) });

  const submit = (values: AdminLogin) => {
    login(values);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="my-auto">
      <h2 className="mb-10 font-medium text-lg text-center">Admin Login</h2>
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
        <span className="font-medium text-[var(--ion-color-medium)]">
          Forgot password?
        </span>
      </div>
      <Button
        id="checkoutFormButton"
        className="h-[50px] mt-[30px]"
        type="submit"
        expand="block"
        loading={loginMutation.isLoading}
      >
        Log in
      </Button>
      {errorMessage && (
        <div className="my-5 text-center">
          <ErrorText text={errorMessage} hideHorizontalBar />
        </div>
      )}
    </form>
  );
};

export default LoginForm;
