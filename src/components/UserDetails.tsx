import { IonIcon } from '@ionic/react';
import { openOutline } from 'ionicons/icons';
import PageLoader from './PageLoader';
import useUsers from '../hooks/useUsers';
import Address from './Address';

interface Props {
  uid: string;
}

const UserDetails = ({ uid }: Props) => {
  const { userQuery } = useUsers({ uid });
  const { data: user, isLoading, isError, error } = userQuery;

  if (isLoading) return <PageLoader />;
  if (isError) return <>An error has occurred</>;
  if (!user) return <>{error}</>;

  const { firstName, lastName, email, phone, address } = user;

  return (
    <div>
      <h3 className='text-lg'>Full name</h3>
      <div>
        {firstName} {lastName}
      </div>
      <h3 className='mt-5 text-lg'>Email</h3>
      <div>
        <a
          href={`mailto:${email}`}
          className='inline-flex items-center text-[var(--ion-color-primary)] hover:text-[var(--ion-color-primary-shade)]'
        >
          {email}
          <IonIcon icon={openOutline} color='primary' className='ml-1' />
        </a>
      </div>
      <h3 className='mt-5 text-lg'>Phone number</h3>
      <div>
        {phone ? phone : <span className='text-gray-500'>Not available</span>}
      </div>
      <h3 className='mt-5 text-lg'>Address</h3>
      <div>
        {address ? (
          <Address />
        ) : (
          <span className='text-gray-500'>Not available</span>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
