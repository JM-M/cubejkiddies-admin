import cx from 'classnames';
import { useSlate } from 'slate-react';
import { isMarkActive, toggleMark } from '../../hooks/useSlateEditor';

const MarkButton = ({ format, icon: Icon }: any) => {
  const editor = useSlate();
  const active = isMarkActive(editor, format);
  return (
    <button
      type='button'
      className={cx(
        'inline-block h-fit w-fit p-2 rounded-md overflow-hidden hover:bg-gray-100',
        {
          'bg-blue-100': active,
        }
      )}
      onMouseDown={(event: any) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon />
    </button>
  );
};

export default MarkButton;
