import { RouteComponentProps } from 'react-router';
import Page from '../components/Page';
import AdminDetails from '../components/AdminDetails';

interface Props
  extends RouteComponentProps<{
    uid: string;
  }> {}

const Admin: React.FC<Props> = ({ match }) => {
  return (
    <Page title='Admin' backButtonHref='/Admins' backButton>
      <AdminDetails uid={match.params.uid} />
    </Page>
  );
};

export default Admin;
