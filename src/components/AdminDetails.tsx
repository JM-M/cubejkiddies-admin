import { IonIcon } from '@ionic/react';
import { openOutline, trashOutline } from 'ionicons/icons';
import PageLoader from './PageLoader';
import Button from './Button';
import useAdmins from '../hooks/useAdmins';
import DeleteModal from './DeleteModal';

interface Props {
  uid: string;
}

const AdminDetails = ({ uid }: Props) => {
  const { adminQuery, deleteAdmin, adminDeletionMutation } = useAdmins({ uid });
  const { data: admin, isLoading, isError, error } = adminQuery;

  if (isLoading) return <PageLoader />;
  if (isError) return <>An error has occurred</>;
  if (!admin) return <>{error}</>;

  const { firstName, lastName, email, primary = false } = admin;
  const fullName = `${firstName} ${lastName}`;

  return (
    <div>
      <h3 className='text-lg'>Full name</h3>
      <div>{fullName}</div>
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
      {!primary && (
        <>
          <DeleteModal
            trigger='delete-admin-button'
            initialBreakpoint={0.35}
            deleteHandler={deleteAdmin}
            deleting={adminDeletionMutation.isLoading}
          >
            Are you sure you want to delete {fullName}
            {"'s"} admin account?
          </DeleteModal>
          <Button
            color='danger'
            className='block w-fit mt-10 ml-auto'
            id='delete-admin-button'
          >
            <IonIcon icon={trashOutline} className='inline-block mr-2' /> Delete
          </Button>
        </>
      )}
    </div>
  );
};

export default AdminDetails;
