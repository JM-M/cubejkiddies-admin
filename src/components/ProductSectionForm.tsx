import { useEffect } from 'react';
import {
  IonItem,
  IonInput,
  IonButton,
  IonSpinner,
  IonIcon,
  useIonRouter,
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import { useQuery } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { doc, getDoc } from 'firebase/firestore';
import cx from 'classnames';

import ProductSelector from './ProductSelector';
import PageLoader from './PageLoader';
import Button from './Button';
import DeleteModal from './DeleteModal';
import { db } from '../../firebase';
import productSectionSchema, {
  ProductSection,
} from '../constants/schemas/productSection';
import { Product } from '../constants/schemas/product';
import useProductSections from '../hooks/useProductSections';
import useProductSection from '../hooks/useProductSection';

interface Props {
  sectionId?: string;
}

type FieldType = 'title' | 'products';

const ProductSectionForm = ({ sectionId }: Props) => {
  const ionRouter = useIonRouter();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: yupResolver(productSectionSchema),
  });

  const touched = !!Object.keys(touchedFields).length;

  const {
    saveProductSection,
    productSectionMutation,
    productSectionQuery,
    deleteProductSection,
    productSectionDeletionMutation,
  } = useProductSections({
    productSectionId: sectionId,
    onMutationSuccess: () => ionRouter.push('/home-product-sections'),
  });
  const productSection = productSectionQuery.data;

  useEffect(() => {
    if (!productSection || touched) return;
    const { title } = productSection;
    setValue('title', title);
  }, [productSection]);

  const { productsQuery } = useProductSection(productSection);
  // console.log(productsQuery.data);

  useEffect(() => {
    const { data: products } = productsQuery;
    // console.log(productsQuery);
    if (
      !productSection ||
      touched ||
      productSection.category ||
      !products?.length
    )
      return;
    setValue('products', products);
  }, [productsQuery]);

  const onSubmit = (values: ProductSection) => {
    if (sectionId) return saveProductSection({ ...values, id: sectionId });
    saveProductSection(values);
  };

  const onSelectionChange = (selection: boolean, product: Product) => {
    const products = watch('products') || [];
    console.log(product);
    if (selection) {
      setValue('products', [...products, product]);
    } else {
      setValue(
        'products',
        products.filter(({ id }) => id !== product.id)
      );
    }
  };

  const submitting = productSectionMutation.isLoading;

  const loading = productSectionQuery.isLoading || productsQuery.isLoading;
  if (loading) return <PageLoader />;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <IonItem
          className={cx({
            'ion-invalid': !!errors.title,
            'ion-valid': !errors.title,
          })}
        >
          <IonInput
            label='Section title'
            labelPlacement='floating'
            className='text-lg font-medium'
            {...register('title')}
            onIonChange={(ev) =>
              ev?.target?.value && setValue('title', ev.target.value as string)
            }
            errorText={errors.title?.message}
          />
        </IonItem>
        <Controller
          control={control}
          name='products'
          render={({ field: { value = [] } }) => {
            return (
              <ProductSelector
                initialSelection={value}
                onSelectionChange={onSelectionChange}
                error={errors.products?.message}
              />
            );
          }}
        />
        <IonButton
          id='checkoutFormButton'
          className='h-10 mt-[30px]'
          type='submit'
          expand='block'
          disabled={submitting}
        >
          {submitting ? (
            <>
              <IonSpinner name='dots' className='inline-block mr-3' />{' '}
              Submitting
            </>
          ) : (
            'Submit'
          )}
        </IonButton>
      </form>
      <div>
        <DeleteModal
          trigger='delete-admin-button'
          initialBreakpoint={0.35}
          deleteHandler={deleteProductSection}
          deleting={productSectionDeletionMutation.isLoading}
        >
          Are you sure you want to delete <b>{watch('title')}</b> section?
        </DeleteModal>
        <Button
          fill='outline'
          color='danger'
          className='block w-full h-10 my-5 ml-auto'
          id='delete-admin-button'
        >
          <IonIcon icon={trashOutline} className='inline-block mr-2' /> Delete
        </Button>
      </div>
    </>
  );
};

export default ProductSectionForm;
