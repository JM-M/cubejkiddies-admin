import { object, string, boolean, mixed, InferType } from "yup";
import productSchema from "./product";

const slideSchema = object({
  image: mixed().required(),
  button: boolean(),
  buttonText: string().when("button", {
    is: true,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema,
  }),
  buttonLinkType: string().when("button", {
    is: true,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema,
  }),
  category: string().when("buttonLinkType", {
    is: (buttonLinkType: string) => buttonLinkType === "category",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema,
  }),
  product: mixed().when("buttonLinkType", {
    is: (buttonLinkType: string) => buttonLinkType === "product",
    then: (schema) => productSchema.required(),
    otherwise: (schema) => schema,
  }),
});

export type HomeSlideFormValues = InferType<typeof slideSchema>;

export default slideSchema;
