import { IonIcon } from '@ionic/react';
import { caretBackOutline, caretForwardOutline } from 'ionicons/icons';

const TableController: React.FC<{
  page: number;
  onPageChange: (page: number) => void;
  onPagePrev: () => void;
  onPageNext: () => void;
  totalPages: number;
}> = ({
  page = 1,
  onPageChange = () => null,
  onPagePrev = () => null,
  onPageNext = () => null,
  totalPages = 1,
}) => {
  const hasPrevPage = page && page > 1;
  const hasNextPage = page && page < totalPages;

  const prev = () => {
    if (!hasPrevPage) return;
    onPageChange(page - 1);
    onPagePrev();
  };
  const next = () => {
    if (!hasNextPage) return;
    onPageChange(page + 1);
    onPageNext();
  };

  return (
    <div className='mt-[30px] flex justify-center items-center gap-[20px]'>
      {/* Go to page
      <input
        type='number'
        className='w-[40px] px-2 py-1 text-center'
        value={page}
        onChange={(ev) => {
          const page = +ev.target.value;
          if (isNaN(page)) return;
          onPageChange(page);
        }}
      /> */}
      <IonIcon
        icon={caretBackOutline}
        color={hasPrevPage ? 'dark' : 'medium'}
        onClick={prev}
      />
      <span className='font-medium'>
        {page} / {totalPages}
      </span>
      <IonIcon
        icon={caretForwardOutline}
        color={hasNextPage ? 'dark' : 'medium'}
        onClick={next}
      />
    </div>
  );
};

export default TableController;
