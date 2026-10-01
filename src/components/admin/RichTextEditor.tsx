import React, { useRef, useState, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Heading2, Heading3, Strikethrough, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isRtl?: boolean;
}

export default function RichTextEditor({ value, onChange, placeholder, isRtl }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Initialize value only once when mounted or when value changes externally (not by user typing)
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML && !isFocused) {
      editorRef.current.innerHTML = value;
    }
  }, [value, isFocused]);

  const exec = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const addLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      exec('createLink', url);
    }
  };

  const addImage = () => {
    const url = prompt('Enter Image URL:');
    if (url) {
      exec('insertImage', url);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const Button = ({ onClick, icon: Icon, title }: { onClick: () => void, icon: any, title: string }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden focus-within:border-emerald-500 transition-colors">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-800 bg-slate-950/50">
        <Button onClick={() => exec('formatBlock', 'H2')} icon={Heading2} title="Heading 2" />
        <Button onClick={() => exec('formatBlock', 'H3')} icon={Heading3} title="Heading 3" />
        <div className="w-px h-4 bg-slate-700 mx-1" />
        <Button onClick={() => exec('bold')} icon={Bold} title="Bold" />
        <Button onClick={() => exec('italic')} icon={Italic} title="Italic" />
        <Button onClick={() => exec('underline')} icon={Underline} title="Underline" />
        <Button onClick={() => exec('strikeThrough')} icon={Strikethrough} title="Strikethrough" />
        <div className="w-px h-4 bg-slate-700 mx-1" />
        <Button onClick={() => exec('insertUnorderedList')} icon={List} title="Bullet List" />
        <Button onClick={() => exec('insertOrderedList')} icon={ListOrdered} title="Numbered List" />
        <div className="w-px h-4 bg-slate-700 mx-1" />
        <Button onClick={() => exec('justifyLeft')} icon={AlignLeft} title="Align Left" />
        <Button onClick={() => exec('justifyCenter')} icon={AlignCenter} title="Align Center" />
        <Button onClick={() => exec('justifyRight')} icon={AlignRight} title="Align Right" />
        <div className="w-px h-4 bg-slate-700 mx-1" />
        <Button onClick={addLink} icon={LinkIcon} title="Add Link" />
        <Button onClick={addImage} icon={ImageIcon} title="Add Image" />
      </div>
      
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          handleInput();
        }}
        className={`p-4 min-h-[250px] max-h-[500px] overflow-y-auto text-sm font-sans text-slate-100 focus:outline-none prose prose-invert prose-emerald max-w-none ${isRtl ? 'text-right' : 'text-left'}`}
        dir={isRtl ? 'rtl' : 'ltr'}
        data-placeholder={placeholder}
        style={{
          whiteSpace: 'pre-wrap'
        }}
      />
    </div>
  );
}
