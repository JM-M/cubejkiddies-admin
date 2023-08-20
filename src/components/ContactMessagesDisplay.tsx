import format from "date-fns/format";
import useContactMessages from "../hooks/useContactMessages";
import PageLoader from "./PageLoader";
import Button from "./Button";
import { Link } from "react-router-dom";

const ContactMessagesDisplay = () => {
  const { contactMessages, contactMessagesQuery } = useContactMessages();
  const { isLoading, fetchNextPage, hasNextPage, isFetching } =
    contactMessagesQuery;
  if (isLoading) return <PageLoader />;
  if (!contactMessages?.length)
    return (
      <div className="h-fit w-fit m-auto text-gray-500">No messages found</div>
    );
  return (
    <div>
      <ul>
        {contactMessages.map(({ message, user, createdAt }, index: number) => {
          return (
            <li key={index} className="mb-5 p-5 bg-gray-100 rounded-lg">
              <div className="mb-3">
                <div>
                  {user.firstName} {user.lastName}
                </div>
                <div>
                  <Link to={`mailto:${user.email}`}>{user?.email}</Link>
                </div>
                {createdAt && (
                  <div>{format(createdAt.toDate(), "dd MMM yyyy")}</div>
                )}
              </div>
              <div>{message}</div>
            </li>
          );
        })}
      </ul>
      {hasNextPage && (
        <Button
          color="secondary"
          className="block h-10 w-fit mx-auto mt-10"
          loading={isFetching}
          onClick={fetchNextPage}
        >
          Load more
        </Button>
      )}
    </div>
  );
};

export default ContactMessagesDisplay;
