import {
  RichTextEditor,
  Link,
  useRichTextEditorContext,
} from '@mantine/tiptap';
import { type Editor, useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { useEffect } from 'react';
import { Button, Loader } from '@mantine/core';
import clsx from 'clsx';

export interface TextEditorProps {
  content?: object | null;
  saving?: boolean;
  generating?: boolean;
  showGenerate?: boolean;
  onGenerate?: () => void;
  onUpdate?: (editor: Editor) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export const editorExtensions = [
  StarterKit,
  Underline,
  Link,
  Superscript,
  SubScript,
  Highlight,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
];

const Generate = ({
  onClick = noop,
  generating = false,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: () => any;
  generating?: boolean;
}) => {
  const { editor } = useRichTextEditorContext();

  return (
    <RichTextEditor.Control className="border-none ml-2">
      <Button
        onClick={onClick}
        disabled={editor?.getText()?.trim()?.length === 0 || generating}
        loading={generating}
        px="sm"
      >
        Generate
      </Button>
    </RichTextEditor.Control>
  );
};

const SavingIndicator = ({ visible }: { visible?: boolean }) => {
  return (
    <RichTextEditor.Control className="border-none cursor-auto">
      <Loader
        size={20}
        className={clsx(
          'transition-opacity duration-100',
          visible ? 'opacity-100' : 'opacity-0',
        )}
      />
    </RichTextEditor.Control>
  );
};

export const TextEditor = ({
  content,
  saving = false,
  showGenerate = false,
  generating = false,
  onGenerate = noop,
  onUpdate = noop,
}: TextEditorProps) => {
  const editor = useEditor({
    extensions: editorExtensions,
    content,
  });

  useEffect(() => {
    if (!editor) return;

    const updateListener = () => onUpdate(editor);

    editor.on('update', updateListener);

    return () => {
      editor.off('update', updateListener);
    };
  }, [editor, onUpdate]);

  return (
    <RichTextEditor
      editor={editor}
      className="flex-grow border-none flex flex-col relative overflow-y-auto"
    >
      <RichTextEditor.Toolbar
        sticky
        // stickyOffset={60}
        className="border-b-zinc-200"
      >
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup className="flex-grow" />

        <RichTextEditor.ControlsGroup>
          <SavingIndicator visible={saving} />
          {showGenerate && (
            <Generate onClick={onGenerate} generating={generating} />
          )}
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content className="overflow-y-auto" />
    </RichTextEditor>
  );
};
