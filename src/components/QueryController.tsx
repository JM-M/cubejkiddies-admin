import { IonButton } from '@ionic/react';
import { CiFilter } from 'react-icons/ci';
import QuerySortButton from './QuerySortButton';

interface Props {
  sortOptions?: string[];
  onSort?: (option: string) => void;
  filterOptions?: string[]; // change later
}

const QueryController = ({ onSort, sortOptions, filterOptions }: Props) => {
  return (
    <div className='flex items-center gap-[10px]'>
      {sortOptions && onSort && (
        <QuerySortButton options={sortOptions} onSort={onSort} />
      )}
      {filterOptions && (
        <IonButton color='dark' fill='clear' className='ion-no-padding'>
          <span className='px-2'>
            <CiFilter size={20} className='inline-block mr-1' />
            filter
          </span>
        </IonButton>
      )}
    </div>
  );
};

export default QueryController;
