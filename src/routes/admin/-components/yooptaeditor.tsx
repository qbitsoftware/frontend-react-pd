import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import { useMemo } from 'react';
import { useState } from 'react';
import { YooptaContentValue, YooptaOnChangeOptions } from '@yoopta/editor';
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

export default function Editor() {
  const editor = useMemo(() => createYooptaEditor(), []);
  const [value, setValue] = useState<YooptaContentValue>();

  const onChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
    setValue(value);
  };

  return (
    <div className="w-full flex items-center justify-center">
      <YooptaEditor
        placeholder='Start typing here...'
        editor={editor}
        //@ts-ignore
        plugins={plugins}
        autoFocus
        value={value}
        onChange={onChange}
        tools={TOOLS}
        marks={MARKS}
        width={1000}
      />
    </div>
  );
}