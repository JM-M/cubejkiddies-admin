import { Dispatch, SetStateAction } from 'react';
import { IonIcon } from '@ionic/react';
import { listOutline, gridOutline } from 'ionicons/icons';
import cx from 'classnames';

const DisplayController: React.FC<{
  options: { [key: string]: string };
  display: string;
  setDisplay: Dispatch<SetStateAction<string>> | Function;
}> = ({ options = {}, display, setDisplay }) => {
  const keys = Object.keys(options);
  return (
    <div className='flex items-center gap-[10px]'>
      {keys.map((key) => {
        const active = display === key;
        return (
          <span
            key={key}
            className={cx('flex items-center gap-[5px] p-1 rounded-md', {
              'bg-[var(--ion-color-primary)]': active,
            })}
            onClick={() => setDisplay(key)}
          >
            <IonIcon
              icon={options[key]}
              color={active ? 'light' : 'dark'}
              className='h-[22px] w-[22px]'
            />
          </span>
        );
      })}
    </div>
  );
};

export default DisplayController;
