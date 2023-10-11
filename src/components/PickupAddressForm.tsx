import { useForm } from 'react-hook-form';
import Input from './Input';
import PhoneInput from './PhoneInput';
import Button from './Button';
import CountrySelector from './CountrySelector';
import StateSelector from './StateSelector';
import CitySelector from './CitySelector';
import pickupAddress from '../constants/schemas/pickupAddress';
import { yupResolver } from '@hookform/resolvers/yup';
import pickupSchema, {
  PickupAddress,
} from '../constants/schemas/pickupAddress';
import useAuth from '../hooks/useAuth';
import useTerminal from '../hooks/useTerminal';
import PageLoader from './PageLoader';
import { useEffect } from 'react';

type FieldKey =
  | 'firstName'
  | 'lastName'
  | 'phoneNumber'
  | 'email'
  | 'country'
  | 'state'
  | 'city'
  | 'streetAddress'
  | 'additionalDetails'
  | 'zipCode';

interface Props {}

const PickupAddressForm = ({}: Props) => {
  const { admin } = useAuth();

  const {
    defaultSenderAddressMutation,
    defaultSenderAddressQuery,
    defaultSenderAddress,
    getStateFromIsoCode,
    getStateFromName,
  } = useTerminal();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(pickupSchema),
  });

  useEffect(() => {
    if (!defaultSenderAddress) return;
    const {
      first_name,
      last_name,
      phone,
      email,
      line1,
      line2,
      name,
      country,
      state,
      city,
      zip,
    } = defaultSenderAddress;
    const address = {
      firstName: first_name,
      lastName: last_name,
      phoneNumber: phone.replace('+', ''),
      email,
      country,
      state: getStateFromName(state).isoCode,
      city,
      streetAddress: line1,
      additionalDetails: line2,
      zipCode: zip,
    };
    for (const key in address) {
      if (Object.prototype.hasOwnProperty.call(address, key)) {
        const fieldKey = key as FieldKey;
        const value = address[fieldKey];
        setValue(fieldKey, value);
      }
    }
  }, [defaultSenderAddress]);

  if (defaultSenderAddressQuery.isLoading) return <PageLoader />;

  const submit = async (values: PickupAddress) => {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      country,
      state,
      city,
      streetAddress,
      additionalDetails,
      zipCode,
    } = values;
    const address = {
      first_name: firstName,
      last_name: lastName,
      phone: `+${phoneNumber}`,
      email,
      line1: streetAddress,
      line2: additionalDetails,
      name: `${firstName} ${lastName}`,
      country,
      state: getStateFromIsoCode(state)?.name,
      city,
      zip: zipCode,
      metadata: {
        pickup: true,
        admin: admin?.uid,
      },
    };
    defaultSenderAddressMutation.mutate(address);
  };

  const [country, state, city] = [
    watch('country'),
    watch('state'),
    watch('city'),
  ];

  const submitting = defaultSenderAddressMutation.isLoading;

  return (
    <form onSubmit={handleSubmit((values) => submit(values))}>
      <h3 className='mb-1 text-gray-500'>CONTACT INFORMATION</h3>
      <Input
        label='First name'
        labelPlacement='floating'
        {...register('firstName')}
        errorText={errors.firstName?.message}
      />
      <Input
        label='Last name'
        labelPlacement='floating'
        {...register('lastName')}
        errorText={errors.lastName?.message}
      />
      <Input
        label='Email'
        type='email'
        labelPlacement='floating'
        {...register('email')}
        errorText={errors.email?.message}
      />
      <PhoneInput
        label='Phone number'
        aria-label='Phone number'
        name='phoneNumber'
        control={control}
        errorText={errors.phoneNumber?.message}
      />
      <h3 className='mt-6 mb-1 text-gray-500'>PICKUP ADDRESS</h3>
      <CountrySelector
        register={register}
        name='country'
        label='Country'
        value={country}
        setValue={(country: string) => {
          setValue('country', country);
          setValue('state', '');
          setValue('city', '');
        }}
        error={errors.country}
      />
      <StateSelector
        register={register}
        name='state'
        label='State'
        country={country}
        value={state}
        setValue={(state: string) => {
          setValue('state', state);
          setValue('city', '');
        }}
        error={errors.state}
      />
      <CitySelector
        register={register}
        name='city'
        label='City'
        country={country}
        state={state}
        value={city}
        setValue={(city: string) => setValue('city', city)}
        error={errors.city}
      />
      <Input
        label='Street address'
        labelPlacement='floating'
        {...register('streetAddress')}
        errorText={errors.streetAddress?.message}
      />
      <Input
        label='Additional details'
        labelPlacement='floating'
        {...register('additionalDetails')}
        errorText={errors.additionalDetails?.message}
      />
      <Input
        label='Zip code'
        labelPlacement='floating'
        {...register('zipCode')}
        errorText={errors.zipCode?.message}
      />
      <Button
        id='checkoutFormButton'
        className='h-[50px] mt-[30px]'
        type='submit'
        expand='block'
        disabled={submitting}
      >
        Continue
      </Button>
    </form>
  );
};

export default PickupAddressForm;
