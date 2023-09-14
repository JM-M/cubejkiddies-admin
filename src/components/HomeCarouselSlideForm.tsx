import { useState, useCallback, useMemo, useEffect } from 'react';
import { IonToggle, IonItem, IonSelect, IonSelectOption } from '@ionic/react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ImageUpload from './ImageUpload';
import Typeahead from './Typeahead';
import ProductSelector from './ProductSelector';
import Button from './Button';
import Input from './Input';
import PageLoader from './PageLoader';
import ErrorText from './ErrorText';
import useCategories, { Category } from '../hooks/useCategories';
import { Product } from '../constants/schemas/product';
import slideSchema, {
  HomeSlideFormValues,
} from '../constants/schemas/homeSlide';
import useHomeSlides, { HomeSlide } from '../hooks/useHomeSlides';

type Fields =
  | 'category'
  | 'product'
  | 'image'
  | 'button'
  | 'buttonText'
  | 'buttonLinkType';

interface Props {
  homeSlideId?: string;
}

const HomeCarouselSlideForm: React.FC<Props> = ({ homeSlideId = '' }) => {
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);
  const [imageUploadProgress, setImageUploadProgress] = useState<number>();

  const { formSlide, loadingFormSlide, addHomeSlide, addHomeSlideMutation } =
    useHomeSlides({
      homeSlideId,
    });

  useEffect(() => {
    if (!formSlide) return;
    for (const field in formSlide) {
      if (Object.prototype.hasOwnProperty.call(formSlide, field)) {
        const value = formSlide[field];
        setValue(field as Fields, value);
      }
    }
  }, [formSlide]);

  const {
    handleSubmit,
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(slideSchema) });

  const setImageValue = useCallback(
    (value: string) => setValue('image', value),
    [setValue]
  );

  const { categoriesQuery } = useCategories();
  const categoryOptions = useMemo(() => {
    if (!categoriesQuery.data?.docs?.length) return [];
    return categoriesQuery.data.docs
      .map((c: Category) => ({
        text: c.value,
        value: c.value,
      }))
      .sort((a: { text: string }, b: { text: string }) =>
        a.text === b.text ? 0 : a.text > b.text ? 1 : -1
      );
  }, [categoriesQuery.data.docs, categoriesQuery.isFetching]);

  const submit = async (values: HomeSlideFormValues) => {
    const { image, button, buttonText, buttonLinkType, category, product } =
      values;
    const slide: HomeSlide = { image: image as any, button: button! };
    if (button) {
      slide.buttonText = buttonText;
      if (buttonLinkType === 'category') {
        slide.buttonHref = `/category${category}`;
      } else if (buttonLinkType === 'product') {
        slide.buttonHref = `/products/${(product as any)?.id}`;
      }
    }
    if (homeSlideId) slide.id = homeSlideId;
    setUploadingImages(true);
    await addHomeSlide({
      slide,
      onImageUploadProgress: (progress: number) => {
        setImageUploadProgress(Math.round(progress));
      },
    });
    setUploadingImages(false);
  };

  if (loadingFormSlide) return <PageLoader />;

  const button = watch('button');
  const buttonLinkType = watch('buttonLinkType');
  const product = watch('product');

  const uploading = addHomeSlideMutation.isLoading || uploadingImages;

  return (
    <form onSubmit={handleSubmit(submit)}>
      <ImageUpload
        control={control}
        name='image'
        aspectRatio={4 / 3}
        setValue={setImageValue}
        error={errors.image?.message}
      />
      <Controller
        control={control}
        name='button'
        render={({ field, fieldState }) => {
          return (
            <IonItem>
              <IonToggle
                checked={watch(field.name)}
                onIonChange={(e) => {
                  const checked = e?.detail?.checked;
                  setValue(field.name, checked);
                  if (!checked) {
                    setValue('buttonLinkType', undefined);
                    setValue('category', undefined);
                    setValue('product', undefined);
                  }
                }}
              >
                Add button
              </IonToggle>
            </IonItem>
          );
        }}
      />
      <IonItem>
        <Input
          type='buttonText'
          label='buttonText'
          labelPlacement='floating'
          {...register('buttonText')}
          errorText={errors.buttonText?.message}
        />
      </IonItem>
      <Controller
        control={control}
        name='buttonLinkType'
        render={({ field, fieldState: { error } }) => {
          return (
            <>
              <IonItem disabled={!button}>
                <IonSelect
                  interface='action-sheet'
                  label='Button link type'
                  labelPlacement='floating'
                  aria-label={'Button link type'}
                  placeholder='Select'
                  onIonChange={(e) => {
                    const value = e.detail.value;
                    setValue(field.name, value);
                  }}
                >
                  <IonSelectOption value='product'>
                    <IonItem>Product</IonItem>
                  </IonSelectOption>
                  <IonSelectOption value='category'>
                    <IonItem>Category</IonItem>
                  </IonSelectOption>
                </IonSelect>
              </IonItem>
              <ErrorText text={error?.message} />
            </>
          );
        }}
      />
      {buttonLinkType === 'category' && (
        <Typeahead
          name='category'
          register={register}
          title='Categories'
          items={categoryOptions}
          value={watch('category') || ''}
          onSelectionChange={(category: string) => {
            setValue('category', category);
          }}
          error={errors?.category?.message}
          disabled={!button}
        />
      )}
      {buttonLinkType === 'product' && (
        <Controller
          control={control}
          name='product'
          render={({ field, fieldState: { error } }) => {
            return (
              <ProductSelector
                initialSelection={product ? ([product] as Product[]) : []}
                onSelectionChange={(selection: boolean, product: Product) => {
                  if (selection) {
                    setValue('product', product);
                  } else {
                    setValue('product', undefined);
                  }
                }}
                error={error && 'Please select a product'}
                multiselect={false}
                disabled={!button}
              />
            );
          }}
        />
      )}
      <Button type='submit' className='block h-12 mt-10' loading={uploading}>
        {uploadingImages
          ? `Uploading images (${imageUploadProgress}%)`
          : uploading
          ? 'Submitting'
          : 'Submit'}
      </Button>
    </form>
  );
};

export default HomeCarouselSlideForm;
