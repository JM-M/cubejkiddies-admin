import { useEffect } from 'react';
import { IonItem, IonTextarea, IonButton, IonSpinner } from '@ionic/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import cx from 'classnames';
// import ImageUpload from "./ImageUpload";
import PageLoader from './PageLoader';
import aboutSchema, { About } from '../constants/schemas/about';
import useAbout from '../hooks/useAbout';
import SlateEditor from './slate/Editor';
import ErrorText from './ErrorText';

const AboutForm = () => {
  const { about = {}, aboutQuery, update, aboutMutation } = useAbout();

  const {
    register,
    control,
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

  const submit = ({ content, ...rest }: About) => {
    const values = { content: JSON.stringify(content), ...rest };
    update(values);
  };

  const uploading = aboutMutation.isLoading;

  if (aboutQuery.isLoading) return <PageLoader />;

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Controller
        control={control}
        name='content'
        render={({ field: { name }, fieldState: { error } }) => {
          let initialValue;
          if (about.content) initialValue = JSON.parse(about.content);
          return (
            <>
              <SlateEditor
                initialValue={initialValue}
                onChange={(v: any) => setValue(name, v, { shouldTouch: true })}
              />
              <ErrorText text={error?.message} />
            </>
          );
        }}
      />
      <IonButton
        id='checkoutFormButton'
        className='h-[50px] mt-[30px]'
        type='submit'
        expand='block'
        disabled={uploading || !touched}
      >
        {uploading ? (
          <>
            <IonSpinner name='dots' className='inline-block mr-3' /> submitting
          </>
        ) : (
          'submit'
        )}
      </IonButton>
    </form>
  );
};

export default AboutForm;
