import { object, string, InferType } from "yup";

const contactSchema = object({
  phone: string().required(),
  whatsapp: string().required(),
  email: string().email().required(),
});

export type Contact = InferType<typeof contactSchema>;

export default contactSchema;
