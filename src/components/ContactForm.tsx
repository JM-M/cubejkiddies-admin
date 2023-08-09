import { useEffect } from "react";
import {
  IonItem,
  IonButton,
  IonSpinner,
  IonInput,
  IonLabel,
} from "@ionic/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import cx from "classnames";
import PageLoader from "./PageLoader";
import Input from "./Input";
import PhoneInput from "./PhoneInput";
import contactSchema, { Contact } from "../constants/schemas/contact";
import useContact from "../hooks/useContact";

const ContactForm = () => {
  const { contact = {}, contactQuery, update, contactMutation } = useContact();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields = {} },
  } = useForm({
    resolver: yupResolver(contactSchema),
    defaultValues: contact,
  });

  const touched = !!Object.keys(touchedFields).length;

  useEffect(() => {
    if (touched) return;
    for (const field in contact) {
      if (Object.prototype.hasOwnProperty.call(contact, field)) {
        const value = contact[field];
        setValue(field, value);
      }
    }
  }, [touched, contact, setValue]);

  const submit = (values: Contact) => {
    update(values);
  };

  const uploading = contactMutation.isLoading;

  if (contactQuery.isLoading) return <PageLoader />;

  return (
    <form onSubmit={handleSubmit(submit)}>
      <PhoneInput
        label="Phone number"
        aria-label="Phone number"
        name="phone"
        control={control}
        errorText={errors.phone?.message}
      />
      <PhoneInput
        label="WhatsApp number"
        aria-label="WhatsApp number"
        name="whatsapp"
        control={control}
        errorText={errors.whatsapp?.message}
      />
      <Input
        type="email"
        label="Email"
        labelPlacement="floating"
        {...register("email")}
        errorText={errors.lastName?.message}
      />
      <IonButton
        id="checkoutFormButton"
        className="h-[50px] mt-[30px]"
        type="submit"
        expand="block"
        disabled={uploading || !touched}
      >
        {uploading ? (
          <>
            <IonSpinner name="dots" className="inline-block mr-3" /> submitting
          </>
        ) : (
          "submit"
        )}
      </IonButton>
    </form>
  );
};

export default ContactForm;
