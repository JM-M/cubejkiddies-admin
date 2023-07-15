import { PropsWithChildren } from 'react';
import cx from 'classnames';

interface ExpandableProps {
  open?: boolean;
  className?: string;
}

const Expandable = ({
  children,
  open = false,
  className = '',
}: PropsWithChildren<ExpandableProps>) => {
  return (
    <div
      className={cx(
        'grid transition-[grid-template-rows] ease-in-out duration-300 overflow-hidden',
        { 'grid-rows-[1fr]': open, 'grid-rows-[0fr]': !open },
        className
      )}
    >
      <div className='min-h-0'>{children}</div>
    </div>
  );
};

export default Expandable;
