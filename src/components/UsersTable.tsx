import { useState } from "react";
import { useIonRouter, IonSpinner } from "@ionic/react";
import { createColumnHelper } from "@tanstack/react-table";
import { formatDistance } from "date-fns";
import Table from "./Table";
import TableController from "./TableController";

type User = {
  email: string;
  firstName: string;
  lastName: string;
  createdAt: any;
};

interface Props {
  users: User[];
  totalPages?: number;
  onPagePrev?: () => void;
  onPageNext?: () => void;
  loading?: boolean;
}

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("firstName", {
    header: "Name",
  }),
  columnHelper.accessor("email", {
    header: "Email",
  }),
  columnHelper.accessor("createdAt", {
    header: "Created",
    cell: ({ cell }) => {
      const userCreationDate = cell.getValue()?.toDate();
      if (!userCreationDate) return "N/A";
      const dateDistance = formatDistance(userCreationDate, new Date(), {
        addSuffix: true,
      });
      return dateDistance;
    },
  }),
];

const UsersTable = ({
  users,
  totalPages = 0,
  onPageNext = () => null,
  onPagePrev = () => null,
  loading,
}: Props) => {
  const [page, setPage] = useState<number>(1);

  const ionRouter = useIonRouter();

  const goToUser = (row: any) => {
    ionRouter.push(`/users/${row.original.id}`);
  };

  return (
    <>
      <div className="flex flex-col min-h-[300px]">
        {users ? (
          <Table data={users} columns={columns} onRowClick={goToUser} />
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

export default UsersTable;
