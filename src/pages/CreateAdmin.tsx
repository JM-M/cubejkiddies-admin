import Page from "../components/Page";
import AdminForm from "../components/AdminForm";

const CreateAdmin: React.FC = () => {
  return (
    <Page title="Create new admin" backButtonHref="/admins" backButton>
      <AdminForm />
    </Page>
  );
};

export default CreateAdmin;
