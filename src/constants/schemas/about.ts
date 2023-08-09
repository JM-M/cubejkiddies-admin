import { object, string, InferType } from "yup";

const aboutSchema = object({
  text: string().required("Text is required."),
});

export type About = InferType<typeof aboutSchema>;

export default aboutSchema;
