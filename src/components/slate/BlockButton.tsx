import cx from 'classnames';
import { useSlate } from 'slate-react';
import {
  TEXT_ALIGN_TYPES,
  isBlockActive,
  toggleBlock,
} from '../../hooks/useSlateEditor';

const BlockButton = ({ format, icon: Icon }: any) => {
  const editor = useSlate();
  const active = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  );
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
        toggleBlock(editor, format);
      }}
    >
      <Icon />
    </button>
  );
};

export default BlockButton;
