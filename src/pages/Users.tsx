import { IonSearchbar } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import Page from '../components/Page';
import QueryController from '../components/QueryController';
import UsersTable from '../components/UsersTable';

const Users: React.FC = () => {
  return (
    <Page title='Users'>
      <div className='w-fit my-5 rounded-lg overflow-hidden'>
        <IonSearchbar
          searchIcon={searchOutline}
          slot='end'
          placeholder='Search users'
          className='p-0 text-left'
          color='light'
          animated
          autoFocus
        />
      </div>
      <div className='flex justify-end my-5'>
        <QueryController />
      </div>
      <UsersTable />
    </Page>
  );
};

export default Users;
