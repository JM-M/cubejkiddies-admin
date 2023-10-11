import useContactMessages from '../hooks/useContactMessages';
import PageLoader from './PageLoader';
import Button from './Button';
import ContactMessage from './ContactMessage';

const ContactMessagesDisplay = () => {
  const { contactMessages, contactMessagesQuery } = useContactMessages();
  const { isLoading, hasNextPage, fetchNextPage, isFetching } =
    contactMessagesQuery;

  if (isLoading) return <PageLoader />;
  if (!contactMessages?.length)
    return (
      <div className='h-fit w-fit m-auto text-gray-500'>No messages found</div>
    );

  return (
    <div>
      <ul>
        {contactMessages.map((contactMessage, index: number) => {
          return (
            <li key={index}>
              <ContactMessage {...contactMessage} />
            </li>
          );
        })}
      </ul>
      {hasNextPage && (
        <Button
          color='secondary'
          className='block h-10 w-fit mx-auto mt-10'
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
