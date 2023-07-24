import { RouteComponentProps } from 'react-router';
import Page from '../components/Page';
import UserDetails from '../components/UserDetails';

interface Props
  extends RouteComponentProps<{
    uid: string;
  }> {}

const User: React.FC<Props> = ({ match }) => {
  return (
    <Page title='User' backButtonHref='/users' backButton>
      <UserDetails uid={match.params.uid} />
    </Page>
  );
};

export default User;
