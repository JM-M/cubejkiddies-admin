import { useCallback, useMemo } from 'react';
import isHotkey from 'is-hotkey';
import { Editable, withReact, Slate } from 'slate-react';
import { BaseOperation, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import {
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineUnderline,
  AiOutlineOrderedList,
  AiOutlineUnorderedList,
  AiOutlineAlignLeft,
  AiOutlineAlignCenter,
  AiOutlineAlignRight,
} from 'react-icons/ai';
import { LuHeading1, LuHeading2 } from 'react-icons/lu';
import { BsJustify } from 'react-icons/bs';
import Element from './Element';
import Leaf from './Leaf';
import Toolbar from './Toolbar';
import MarkButton from './MarkButton';
import BlockButton from './BlockButton';
import { toggleMark, serializeToText } from '../../hooks/useSlateEditor';
import { EditableProps } from 'slate-react/dist/components/editable';

const HOTKEYS: any = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
};

const DEFAULT_VALUE: any[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

interface Props {
  editableProps?: EditableProps;
  onChange?: Function;
  returnText?: boolean;
  initialValue?: Node[];
}

const SlateEditor: React.FC<Props> = ({
  editableProps = {},
  onChange,
  returnText = false,
  initialValue,
}) => {
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate
      editor={editor}
      initialValue={initialValue || DEFAULT_VALUE}
      onChange={(value) => {
        if (onChange && typeof onChange === 'function') {
          const isAstChange = editor.operations.some(
            (op: BaseOperation) => 'set_selection' !== op.type
          );
          if (isAstChange) {
            onChange(returnText ? serializeToText(value) : value);
          }
        }
      }}
    >
      <Toolbar>
        <MarkButton format='bold' icon={AiOutlineBold} />
        <MarkButton format='italic' icon={AiOutlineItalic} />
        <MarkButton format='underline' icon={AiOutlineUnderline} />
        <BlockButton format='heading-one' icon={LuHeading1} />
        <BlockButton format='heading-two' icon={LuHeading2} />
        <BlockButton format='numbered-list' icon={AiOutlineOrderedList} />
        <BlockButton format='bulleted-list' icon={AiOutlineUnorderedList} />
        <BlockButton format='left' icon={AiOutlineAlignLeft} />
        <BlockButton format='center' icon={AiOutlineAlignCenter} />
        <BlockButton format='right' icon={AiOutlineAlignRight} />
        <BlockButton format='justify' icon={AiOutlineAlignCenter} />
      </Toolbar>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        className='block px-3 outline-none rounded-lg border border-transparent focus:border-gray-400'
        placeholder='Type here'
        spellCheck
        autoFocus
        onKeyDown={(event: any) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
        {...editableProps}
      />
    </Slate>
  );
};

export default SlateEditor;
