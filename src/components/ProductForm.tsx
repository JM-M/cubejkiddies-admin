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
import { createRandomProduct } from '../devUtils/fakeData';

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

interface Props {
  productId?: string;
}

const ProductForm = ({ productId }: Props) => {
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
    defaultValues: { discount: 0 },
  });

  const {
    saveProduct,
    productQuery,
    productMutation,
    generateRecordFromProduct,
  } = useProducts({
    productId,
  });
  const product = productQuery.data;

  const { categoriesQuery, getCategoryFromId, getCategoryFromValue } =
    useCategories();
  const categoryOptions = useMemo(() => {
    if (!categoriesQuery.data?.docs?.length) return [];
    return categoriesQuery.data?.docs
      .map((c: Category) => ({
        text: c.value,
        value: c.value,
      }))
      .sort((a: { text: string }, b: { text: string }) =>
        a.text === b.text ? 0 : a.text > b.text ? 1 : -1
      );
  }, [categoriesQuery.data?.docs, categoriesQuery.isFetching]);

  useEffect(() => {
    if (!product || productQuery.isLoading) return;
    for (const field in product) {
      if (field === 'id') continue;
      if (Object.prototype.hasOwnProperty.call(product, field)) {
        let value = product[field];
        if (field === 'category') {
          value = getCategoryFromId(value)?.value;
        }
        setValue(field as FieldType, value);
      }
    }
  }, [product, productQuery.isLoading, setValue]);

  const onSubmit = async (values: Product) => {
    const product: Product = {
      ...values,
      category: getCategoryFromValue(values?.category)?.id,
    };
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
  if (productId && productQuery.isError)
    return <div>Error fetching product</div>;

  const uploading = productMutation.isLoading || uploadingImages;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className='mt-6 mb-1 text-lg text-gray-500'>GENERAL INFORMATION</h3>
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
          'ion-invalid': !!errors.weight,
          'ion-valid': !errors.weight,
        })}
      >
        <IonInput
          type='number'
          min={1}
          label='Weight (grams)'
          labelPlacement='floating'
          {...register('weight')}
          errorText={errors.weight?.message}
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
          min={0}
          max={100}
          label={`Percentage discount %`}
          labelPlacement='start'
          {...register('discount')}
          errorText={errors.discount?.message}
        />
      </IonItem>
      <h3 className='mt-6 mb-1 text-lg text-gray-500'>ATTRIBUTES</h3>
      <DefaultVariations control={control} />
      <CustomVariations
        variations={variations}
        setValue={setValue}
        unregister={unregister}
        watch={watch}
      />
      <h3 className='mt-6 mb-1 text-lg text-gray-500'>STOCK</h3>
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
        {uploadingImages && !isNaN(imageUploadProgress!)
          ? `Uploading images (${imageUploadProgress}%)`
          : uploading
          ? 'Submitting'
          : 'Submit'}
      </IonButton>
    </form>
  );
};

export default ProductForm;
