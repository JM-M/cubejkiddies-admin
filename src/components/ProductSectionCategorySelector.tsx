import { useEffect, useMemo } from 'react';
import { useIonRouter } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Typeahead from './Typeahead';
import PageLoader from './PageLoader';
import Input from './Input';
import Button from './Button';
import productSectionSchema, {
  ProductSection,
} from '../constants/schemas/productSection';
import useProductSections from '../hooks/useProductSections';
import useCategories, { Category } from '../hooks/useCategories';

interface Props {
  sectionId?: string;
}

type FieldType = 'title' | 'products' | 'category';

const ProductSectionCategorySelector: React.FC<Props> = ({ sectionId }) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    unregister,
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

  useEffect(() => {
    const { data: section } = productSectionQuery;
    if (!section) return;
    for (const field in section) {
      if (Object.prototype.hasOwnProperty.call(section, field)) {
        const value = section[field];
        setValue(field as FieldType, value);
      }
    }
  }, [productSectionQuery.data]);

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

  const submit = (values: ProductSection) => {
    if (sectionId) return saveProductSection({ ...values, id: sectionId });
    saveProductSection(values);
  };

  if (categoriesQuery.isLoading || productSectionQuery.isLoading) {
    return <PageLoader />;
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Input
        label='Section title'
        labelPlacement='floating'
        {...register('title')}
        errorText={errors.title?.message}
      />
      <Typeahead
        name='category'
        register={register}
        title='Categories'
        items={categoryOptions}
        value={watch('category') || ''}
        onSelectionChange={(category) => {
          setValue('category', category);
        }}
        error={errors.category}
      />
      <Button
        id='checkoutFormButton'
        className='h-[50px] mt-[30px]'
        type='submit'
        expand='block'
        loading={productSectionMutation.isLoading}
      >
        Submit
      </Button>
    </form>
  );
};

export default ProductSectionCategorySelector;
