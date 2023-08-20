import { IonIcon } from "@ionic/react";
import { addOutline } from "ionicons/icons";
import Button from "./Button";
import AdminsTable from "./AdminsTable";
import useAdmins from "../hooks/useAdmins";
import PageLoader from "./PageLoader";

const AdminsDisplay = () => {
  const { admins, adminsQuery } = useAdmins();
  const { isLoading, fetchNextPage, fetchPreviousPage, totalPages } =
    adminsQuery;

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <Button
        routerLink="/admins/new"
        fill="outline"
        className="flex w-fit ml-auto mb-5"
      >
        <IonIcon icon={addOutline} className="h-[20px] w-[20px] mr-2" />
        New admin
      </Button>
      <AdminsTable
        admins={admins}
        onPageNext={fetchNextPage}
        onPagePrev={fetchPreviousPage}
        totalPages={totalPages}
        loading={isLoading}
      />
    </div>
  );
};

export default AdminsDisplay;
