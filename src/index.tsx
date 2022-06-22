import { boldCommand } from "./commands/markdown-commands/boldCommand";
import { strikethroughCommand } from "./commands/markdown-commands/strikethroughCommand";
import { linkCommand } from "./commands/markdown-commands/linkCommand";
import { imageCommand } from "./commands/markdown-commands/imageCommand";
import { codeCommand } from "./commands/markdown-commands/codeCommand";
import { useTextAreaMarkdownEditor } from "./hooks/use-markdown-editor";
import { orderedListCommand } from "./commands/markdown-commands/orderedListCommand";
import { unorderedListCommand } from "./commands/markdown-commands/unorderedListCommand";
import { underlineCommand } from "./commands/markdown-commands/underlineCommand";
import { newLineAndIndentContinueMarkdownListCommand } from "./commands/markdown-commands/newLineAndIndentContinueMarkdownListCommand";
import { newLineCommand } from "./commands/markdown-commands/newLineCommand";
import * as React from "react";
import { MarkdownPreview } from "./components/MarkdownPreview";
import { SuggestionsDropdown } from "./components/SuggestionsDropdown";
import { useEffect, useRef, useState } from "react";
import { EditorWrapper, Textarea } from "./components/EditorComponents";
import EditorHeader from "./components/EditorHeader";
import { getHandlers } from "./util/eventHandlers";

export interface Suggestion {
  preview: React.ReactNode;
  value: string;
}

export type DemoProps = {
  value: string;
  onChange: (value: string) => void;
  suggestions?: Suggestion[];
  minHeight?: number;
  disabled?: boolean;
};

export const Editor: React.FunctionComponent<DemoProps> = ({
  value,
  onChange,
  suggestions,
  minHeight = 144,
  disabled: disabled = false
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const { commandController } = useTextAreaMarkdownEditor(ref, {
    commandMap: {
      bold: boldCommand,
      delete: strikethroughCommand,
      code: codeCommand,
      image: imageCommand,
      link: linkCommand,
      ol: orderedListCommand,
      ul: unorderedListCommand,
      underline: underlineCommand,

      newLineAndIndentContinueMarkdownList:
        newLineAndIndentContinueMarkdownListCommand,
      newLine: newLineCommand
    }
  });

  const [caret, setCaret] = useState({ left: 0, top: 0, lineHeight: 20 });
  const [showSuggestion, setShowSuggestion] = React.useState<boolean>(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const [editStatus, setEditStatus] = React.useState<"write" | "preview">(
    "write"
  );
  const isPreview = React.useMemo(() => {
    return editStatus === "preview";
  }, [editStatus]);

  let observer: MutationObserver;

  const [height, setHeight] = useState(100);
  const [userResized, setUserResized] = useState(false);

  const adjustHeight = () => {
    const textarea = ref?.current;
    if (textarea && !userResized) {
      textarea.style.height = `${minHeight}px`;
      textarea.style.height = `${textarea.scrollHeight}px`;
      setHeight(textarea.scrollHeight);
    }
  };

  useEffect(() => {
    //expand height if got default value before inputting
    adjustHeight();
  }, []);

  useEffect(() => {
    const textarea = ref?.current;
    if (typeof window === "undefined") {
      return;
    }
    // @ts-ignore
    if (window.editorObserver) {
      // @ts-ignore
      window.editorObserver?.disconnect();
    }
    if (textarea) {
      // MutationObserver is the modern way to observe element resize event
      observer = new MutationObserver(record => {
        //no value changed && height change => user resized manually
        // @ts-ignore
        if (record[0].target.value === value) {
          setUserResized(true);
          setHeight(parseInt(textarea?.style?.height));
        }
      });
      // @ts-ignore
      window.editorObserver = observer;
      observer.observe(textarea, {
        attributes: true,
        attributeFilter: ["style"]
      });
    }
  }, [height, value, setHeight]);

  const { handleSuggestionSelected, handleKeyDown, handleKeyPress } =
    getHandlers({
      ref,
      suggestions,
      setShowSuggestion,
      showSuggestion,
      setFocusIndex,
      focusIndex,
      setCaret
    });

  const onEnterNewLine = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commandController.executeCommand("newLineAndIndentContinueMarkdownList");
    }
  };

  return (
    <EditorWrapper disabled={disabled}>
      <EditorHeader
        {...{ editStatus, setEditStatus, isPreview, commandController }}
      />
      <Textarea
        ref={ref}
        value={value}
        onChange={event => {
          onChange(event.target.value);
          adjustHeight();
        }}
        onKeyDown={e => {
          handleKeyDown(e);
          onEnterNewLine(e);
        }}
        onKeyPress={handleKeyPress}
        placeholder="Please text here..."
        minHeight={minHeight}
        height={height}
        hide={isPreview}
      />
      {isPreview && <MarkdownPreview content={value} minHeight={minHeight} />}
      {showSuggestion && suggestions && (
        <SuggestionsDropdown
          caret={caret}
          suggestions={suggestions}
          focusIndex={focusIndex}
          textAreaRef={ref}
          onSuggestionSelected={handleSuggestionSelected}
          suggestionsAutoplace
        />
      )}
    </EditorWrapper>
  );
};

export default Editor;
