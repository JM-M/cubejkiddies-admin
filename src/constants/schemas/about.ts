import { object, mixed, string, InferType } from 'yup';
import { serializeToText } from '../../hooks/useSlateEditor';

const aboutSchema = object({
  content: mixed()
    .required('About information is required.')
    .test(
      'slate-document-not-empty',
      'Description must be at least 30 characters.',
      (value) => {
        if (!value) return false;
        const text = serializeToText(value);
        if (!text.replaceAll(' ', '')) return false;
        return text.length >= 1;
      }
    ),
  text: string(),
});

export type About = InferType<typeof aboutSchema>;

export default aboutSchema;
