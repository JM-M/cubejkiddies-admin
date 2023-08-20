import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "./Input";
import Button from "./Button";
import ErrorText from "./ErrorText";
import { adminSignUpSchema, AdminSignUp } from "../constants/schemas/auth";
import useAuth from "../hooks/useAuth";
import useFirebaseErrorMessage from "../hooks/useFirebaseErrorMessage";

const AdminForm = () => {
  const { createAdmin, createAdminMutation } = useAuth();
  const errorMessage = useFirebaseErrorMessage(
    createAdminMutation.error as any
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(adminSignUpSchema),
    defaultValues: { password: "123456", confirmPassword: "123456" },
  });

  const submit = (values: AdminSignUp) => {
    createAdmin(values);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="my-auto">
      <Input
        label="FIrst name"
        labelPlacement="floating"
        {...register("firstName")}
        errorText={errors.firstName?.message}
      />
      <Input
        label="Last name"
        labelPlacement="floating"
        {...register("lastName")}
        errorText={errors.lastName?.message}
      />
      <Input
        label="Email"
        type="email"
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
      <Input
        type="password"
        label="Confirm password"
        labelPlacement="floating"
        {...register("confirmPassword")}
        errorText={errors.confirmPassword?.message}
      />
      <Button
        id="checkoutFormButton"
        className="h-[50px] mt-[30px]"
        type="submit"
        expand="block"
        loading={createAdminMutation.isLoading}
      >
        Create admin
      </Button>
      {errorMessage && (
        <div className="my-5 text-center">
          <ErrorText text={errorMessage} hideHorizontalBar />
        </div>
      )}
    </form>
  );
};

export default AdminForm;
