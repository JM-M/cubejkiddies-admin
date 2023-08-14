import { object, string, number, array, mixed, InferType } from "yup";

const productSchema = object({
  id: string(),
  name: string().required(),
  category: string().required(),
  description: string().required(),
  weight: number().required(),
  price: number().required(),
  discount: number().required().min(1).max(100),
  variations: object(),
  stocks: array()
    .of(
      object({
        images: array().of(mixed()).required(),
        quantity: number().required(),
        variationCombination: object(),
      })
    )
    .required(),
});

export type Product = InferType<typeof productSchema>;

export default productSchema;
