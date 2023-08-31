import { object, string, ref, InferType } from 'yup';

const passwordSchema = string()
  .min(6, 'Password must be at least 6 characters')
  .required('Password is required');

export const adminLoginSchema = object({
  email: string().email('Not a valid email').required('Email is required'),
  password: string().required('Password is required'),
});

export const adminSignUpSchema = object({
  email: string().email('Not a valid email').required('Email is required'),
  firstName: string().required('First name is required'),
  lastName: string().required('Last name is required'),
  password: passwordSchema,
  confirmPassword: string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
    .oneOf([ref('password')], 'Passwords must match'),
});

export type AdminSignUp = InferType<typeof adminSignUpSchema>;

export type AdminLogin = InferType<typeof adminLoginSchema>;
