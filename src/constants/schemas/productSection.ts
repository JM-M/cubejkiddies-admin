import { object, string, array, InferType } from 'yup';
import productSchema from './product';

const productSectionSchema = object({
  id: string(),
  title: string().required(),
  category: string(),
  products: array()
    .of(productSchema)
    .when('category', {
      is: false,
      then: (schema) =>
        schema
          .min(1, 'Please add at least one product to this section')
          .required('Please add at least one product to this section'),
    }),
});

export type ProductSection = InferType<typeof productSectionSchema>;

export default productSectionSchema;
