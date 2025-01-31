import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import { useEffect, useMemo } from 'react';
import { YooptaContentValue } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Table from '@yoopta/table'
import Divider from '@yoopta/divider'
import Accordion from '@yoopta/accordion'
import Code from '@yoopta/code'
import Embed from '@yoopta/embed'
import Callout from '@yoopta/callout'
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
import ActionMenu, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import { Dispatch, SetStateAction } from 'react';

const plugins = [
  Paragraph,
  Table,
  Divider.extend({
    elementProps: {
      divider: (props) => ({
        ...props,
        color: '#007aff',
      }),
    },
  }),
  Accordion,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  NumberedList,
  BulletedList,
  TodoList,
  Code,
  Embed,
];
const TOOLS = {
  Toolbar: {
    tool: Toolbar,
    render: DefaultToolbarRender,
  },
  ActionMenu: {
    tool: ActionMenu,
    render: DefaultActionMenuRender,
  },
  LinkTool: {
    tool: LinkTool,
    render: DefaultLinkToolRender,
  },
};

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

interface Props {
  value: YooptaContentValue | undefined
  setValue: Dispatch<SetStateAction<YooptaContentValue>> | undefined
  readOnly: boolean
}

export default function Editor({ value, setValue, readOnly }: Props) {
  const editor = useMemo(() => createYooptaEditor(), []);
  // const [value, setValue] = useState<YooptaContentValue>();


  if (setValue && readOnly == false) {
    const onChange = (value: YooptaContentValue) => {
      setValue(value);
    };
    return (
      <div className="w-full">
        <YooptaEditor
          // placeholder='Start typing here...'
          editor={editor}
          //@ts-ignore
          plugins={plugins}

          className='w-full border-gray-200 rounded-lg border py-2 px-12'
          autoFocus={true}
          readOnly={readOnly}
          value={value}
          onChange={onChange}
          tools={TOOLS}
          marks={MARKS}
          width={"100%"}
        />
      </div>
    );
  } else if (readOnly) {
    return (
      <div className="w-full">
        <YooptaEditor
          // placeholder='Start typing here...'
          editor={editor}
          //@ts-ignore
          plugins={plugins}

          className='w-full'
          autoFocus={true}
          readOnly={readOnly}
          value={value}
          tools={TOOLS}
          marks={MARKS}
          width={"100%"}
        />
      </div>
    );
  }

}