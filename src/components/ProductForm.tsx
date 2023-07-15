import { useState, useEffect, useMemo } from 'react';
import {
  IonItem,
  IonInput,
  IonTextarea,
  IonButton,
  IonSpinner,
  useIonRouter,
} from '@ionic/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import cx from 'classnames';

import Typeahead from './Typeahead';
import DefaultVariations from './DefaultVariations';
import CustomVariations from './CustomVariations';
import VariationCombinations from './VariationCombinations';
import PageLoader from './PageLoader';

import { NAIRA } from '../constants/unicode';
import productSchema, { Product } from '../constants/schemas/product';
import useProducts from '../hooks/useProducts';
import useCategories, { Category } from '../hooks/useCategories';

type FieldType =
  | 'name'
  | 'category'
  | 'description'
  | 'price'
  | 'discount'
  | 'variations'
  | 'stocks'
  | `stocks.${number}`
  | `stocks.${number}.images`
  | `stocks.${number}.quantity`
  | `stocks.${number}.variationCombination`
  | `stocks.${number}.images.${number}`;

const ProductForm: React.FC<{ productId?: string }> = ({ productId }) => {
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);
  const [imageUploadProgress, setImageUploadProgress] = useState<number>();

  const ionRouter = useIonRouter();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    unregister,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
  });

  const { saveProduct, productQuery, productMutation } = useProducts({
    productId,
  });
  const product = productQuery.data;

  const { categoriesQuery } = useCategories();
  const categoryOptions = useMemo(() => {
    if (!categoriesQuery.data?.length) return [];
    return categoriesQuery.data
      .map((c: Category) => ({
        text: c.value,
        value: c.value,
      }))
      .sort((a: { text: string }, b: { text: string }) =>
        a.text === b.text ? 0 : a.text > b.text ? 1 : -1
      );
  }, [categoriesQuery.data, categoriesQuery.isFetching]);

  useEffect(() => {
    if (!product || productQuery.isLoading) return;
    for (const field in product) {
      if (field === 'id') continue;
      if (Object.prototype.hasOwnProperty.call(product, field)) {
        const value = product[field];
        setValue(field as FieldType, value);
      }
    }
  }, [product, productQuery.isLoading, setValue]);

  const onSubmit = async (product: Product) => {
    setUploadingImages(true);
    // upload data
    const returnedProductId = await saveProduct({
      product,
      productId,
      onImageUploadProgress: ({ index, progress, total }) => {
        const bin = 100 / total;
        setImageUploadProgress(Math.round(bin * (index + progress / 100)));
      },
    });
    setUploadingImages(false);

    // redirect to product preview page
    ionRouter.push(`/products/${returnedProductId}/preview`);
  };

  const variations = watch('variations');

  if (categoriesQuery.isLoading || (productId && productQuery.isLoading)) {
    return <PageLoader />;
  }
  if (productId && productQuery.isError) return 'Error fetching product';

  const uploading = productMutation.isLoading || uploadingImages;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className='mt-6 mb-1 text-lg text-gray-500'>General Information</h3>
      <IonItem
        className={cx({
          'ion-invalid': !!errors.name,
          'ion-valid': !errors.name,
        })}
      >
        <IonInput
          label='Name'
          labelPlacement='floating'
          {...register('name')}
          errorText={errors.name?.message}
        />
      </IonItem>

      <Typeahead
        name='category'
        register={register}
        title='Categories'
        items={categoryOptions}
        value={watch('category')}
        onSelectionChange={(category) => {
          setValue('category', category);
        }}
        error={errors.category}
      />
      <IonItem
        className={cx({
          'ion-invalid': !!errors.description,
          'ion-valid': !errors.description,
        })}
      >
        <IonTextarea
          label='Description'
          labelPlacement='floating'
          {...register('description')}
          errorText={errors.description?.message}
          autoGrow
        />
      </IonItem>
      <IonItem
        className={cx({
          'ion-invalid': !!errors.price,
          'ion-valid': !errors.price,
        })}
      >
        <IonInput
          type='number'
          label={`Price ${NAIRA}`}
          labelPlacement='start'
          {...register('price')}
          errorText={errors.price?.message}
        />
      </IonItem>
      <IonItem
        className={cx({
          'ion-invalid': !!errors.discount,
          'ion-valid': !errors.discount,
        })}
      >
        <IonInput
          type='number'
          min={1}
          max={100}
          label={`Percentage discount %`}
          labelPlacement='start'
          {...register('discount')}
          errorText={errors.discount?.message}
        />
      </IonItem>
      <h3 className='mt-6 mb-1 text-lg text-gray-500'>Variations</h3>
      <DefaultVariations control={control} />
      <CustomVariations
        variations={variations}
        setValue={setValue}
        unregister={unregister}
        watch={watch}
      />
      <h3 className='mt-6 mb-1 text-lg text-gray-500'>Stocks</h3>
      <VariationCombinations
        register={register}
        setValue={setValue}
        control={control}
        variations={variations}
        watch={watch}
        errors={errors.stocks}
      />
      <IonButton
        id='checkoutFormButton'
        className='h-[50px] mt-[30px]'
        type='submit'
        expand='block'
        disabled={uploading}
      >
        {uploading && <IonSpinner name='dots' className='inline-block mr-3' />}
        {uploadingImages
          ? `Uploading images (${imageUploadProgress}%)`
          : uploading
          ? 'Submitting'
          : 'Submit'}
      </IonButton>
    </form>
  );
};

export default ProductForm;
