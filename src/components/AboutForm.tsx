import { useEffect } from "react";
import { IonItem, IonTextarea, IonButton, IonSpinner } from "@ionic/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import cx from "classnames";
// import ImageUpload from "./ImageUpload";
import PageLoader from "./PageLoader";
import aboutSchema, { About } from "../constants/schemas/about";
import useAbout from "../hooks/useAbout";

const AboutForm = () => {
  const { about = {}, aboutQuery, update, aboutMutation } = useAbout();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields = {} },
  } = useForm({
    resolver: yupResolver(aboutSchema),
    defaultValues: about,
  });
  const touched = !!Object.keys(touchedFields).length;

  useEffect(() => {
    if (touched) return;
    for (const field in about) {
      if (Object.prototype.hasOwnProperty.call(about, field)) {
        const value = about[field];
        setValue(field, value);
      }
    }
  }, [touched, about, setValue]);

  const submit = (values: About) => {
    update(values);
  };

  const uploading = aboutMutation.isLoading;

  if (aboutQuery.isLoading) return <PageLoader />;

  return (
    <form onSubmit={handleSubmit(submit)}>
      <IonItem
        className={cx({
          "ion-invalid": !!errors.text,
          "ion-valid": !errors.text,
        })}
      >
        <IonTextarea
          label="Text"
          labelPlacement="floating"
          {...register("text")}
          errorText={errors.text?.message as any}
          autoGrow
        />
      </IonItem>
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

export default AboutForm;
