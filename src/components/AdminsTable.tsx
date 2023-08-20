import { useMemo, useState } from "react";
import { useIonRouter, IonSpinner } from "@ionic/react";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import Table from "./Table";
import TableController from "./TableController";
import { Admin } from "../hooks/useAdmins";
import useAuth from "../hooks/useAuth";

interface Props {
  admins: Admin[];
  totalPages?: number;
  onPagePrev?: () => void;
  onPageNext?: () => void;
  loading?: boolean;
}

const columnHelper = createColumnHelper<Admin>();

const AdminsTable = ({
  admins,
  totalPages = 0,
  onPageNext = () => null,
  onPagePrev = () => null,
  loading,
}: Props) => {
  const [page, setPage] = useState<number>(1);

  const ionRouter = useIonRouter();

  const { isLoggedIn, uid = "" } = useAuth();

  const columns = useMemo(
    () => [
      columnHelper.accessor("firstName", {
        header: "Name",
        cell: ({ row: { original } }) => {
          const fullName = `${original.firstName} ${original.lastName}`;
          if (isLoggedIn && uid && original.uid === uid)
            return `${fullName} (You)`;
          return fullName;
        },
      }),
      columnHelper.accessor("createdAt", {
        header: "Created",
        cell: ({ cell }) => {
          const adminCreationDate = cell.getValue()?.toDate();
          if (!adminCreationDate) return "N/A";
          const dateDistance = format(adminCreationDate, "dd MMM yyyy");
          return dateDistance;
        },
      }),
    ],
    [uid]
  );

  const goToAdmin = (row: any) => {
    ionRouter.push(`/admins/${row.original.id}`);
  };

  return (
    <>
      <div className="flex flex-col min-h-[300px]">
        {admins ? (
          <Table data={admins} columns={columns} onRowClick={goToAdmin} />
        ) : (
          <span className="m-auto">
            {loading ? (
              <span className="text-gray-500">Page not found</span>
            ) : (
              <IonSpinner name="circular" />
            )}
          </span>
        )}
      </div>
      <TableController
        page={page}
        onPageChange={(page) => setPage(page)}
        onPagePrev={onPagePrev}
        onPageNext={onPageNext}
        totalPages={totalPages}
      />
    </>
  );
};

export default AdminsTable;
