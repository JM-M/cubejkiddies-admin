import { object, string, InferType } from 'yup';

const pickupAddressSchema = object({
  firstName: string().required(),
  lastName: string().required(),
  phoneNumber: string().required('Phone number is required'),
  email: string().email().required(),
  country: string().required('Please select a country'),
  state: string().required('State is required'),
  city: string().required('City is required'),
  streetAddress: string().required('Street address is required'),
  additionalDetails: string(),
  zipCode: string().required('Postal/Zip code is required'),
});

export type PickupAddress = InferType<typeof pickupAddressSchema>;

export default pickupAddressSchema;
