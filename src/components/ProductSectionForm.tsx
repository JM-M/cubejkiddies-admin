import {
  IonItem,
  IonInput,
  IonButton,
  IonSpinner,
  useIonRouter,
} from '@ionic/react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { doc, getDoc } from 'firebase/firestore';
import cx from 'classnames';

import ProductSelector from './ProductSelector';
import productSectionSchema, {
  ProductSection,
} from '../constants/schemas/productSection';
import { Product } from '../constants/schemas/product';
import useProductSections from '../hooks/useProductSections';
import PageLoader from './PageLoader';
import { useQuery } from '@tanstack/react-query';
import { db } from '../../firebase';

interface Props {
  sectionId?: string;
}

type FieldType = 'title' | 'products';

const ProductSectionForm = ({ sectionId }: Props) => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSectionSchema),
  });

  const ionRouter = useIonRouter();

  const { saveProductSection, productSectionMutation, productSectionQuery } =
    useProductSections({
      productSectionId: sectionId,
      onMutationSuccess: () => ionRouter.push('/home-product-sections'),
    });
  const productSection = productSectionQuery.data;
  const productIds = productSection?.products;

  const productsQuery = useQuery({
    queryKey: ['product-section-products', sectionId, productIds],
    queryFn: async () => {
      if (!productIds) return null;
      const products = [];
      for (let index = 0; index < productIds.length; index++) {
        const productId = productIds[index];
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          products.push({ ...docSnap.data(), id: productId });
        }
      }
      return products;
    },
    onSuccess: (products: Product[] = []) => {
      if (!products) return;
      for (const field in productSection) {
        if (field === 'id' || field === 'products') continue;
        if (Object.prototype.hasOwnProperty.call(productSection, field)) {
          const value = productSection[field];
          setValue(field as FieldType, value);
        }
      }
      setValue('products', products);
    },
  });

  const onSubmit = (values: ProductSection) => {
    if (sectionId) return saveProductSection({ ...values, id: sectionId });
    saveProductSection(values);
  };

  const onSelectionChange = (selection: boolean, product: Product) => {
    const products = watch('products') || [];
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
              error={errors.products}
            />
          );
        }}
      />
      <IonButton
        id='checkoutFormButton'
        className='h-[50px] mt-[30px]'
        type='submit'
        expand='block'
        disabled={submitting}
      >
        {submitting ? (
          <>
            <IonSpinner name='dots' className='inline-block mr-3' /> Submitting
          </>
        ) : (
          'Submit'
        )}
      </IonButton>
    </form>
  );
};

export default ProductSectionForm;
