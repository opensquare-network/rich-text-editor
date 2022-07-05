import * as React from "react";
import Opensquare from "./styles/opensquare";
import Subsqaure from "./styles/subsqaure";
import { useEffect, useRef, useState } from "react";
import { useTextAreaMarkdownEditor } from "./hooks/use-markdown-editor";
import { boldCommand } from "./commands/markdown-commands/boldCommand";
import { strikethroughCommand } from "./commands/markdown-commands/strikethroughCommand";
import { codeCommand } from "./commands/markdown-commands/codeCommand";
import { imageCommand } from "./commands/markdown-commands/imageCommand";
import { linkCommand } from "./commands/markdown-commands/linkCommand";
import { orderedListCommand } from "./commands/markdown-commands/orderedListCommand";
import { unorderedListCommand } from "./commands/markdown-commands/unorderedListCommand";
import { underlineCommand } from "./commands/markdown-commands/underlineCommand";
import { newLineAndIndentContinueMarkdownListCommand } from "./commands/markdown-commands/newLineAndIndentContinueMarkdownListCommand";
import { newLineCommand } from "./commands/markdown-commands/newLineCommand";
import { getHandlers } from "./util/eventHandlers";
import { EditorWrapper, Textarea } from "./components/EditorComponents";
import EditorHeader from "./components/EditorHeader";
import PreviewWrapper from "./components/PreviewWrapper";
import {
  MarkdownPreviewer,
  renderIdentityOrAddressPlugin
} from "@osn/previewer";
import { SuggestionsDropdown } from "./components/SuggestionsDropdown";
import { Suggestion, DemoProps, MentionState } from "./interfaces";

export const Editor: React.FunctionComponent<DemoProps> = ({
  value,
  onChange,
  loadSuggestions,
  minHeight = 144,
  theme = "opensquare",
  disabled = false,
  identifier
}) => {
  const themeCSS = theme === "opensquare" ? Opensquare : Subsqaure;
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

      newLineAndIndentContinueMarkdownList: newLineAndIndentContinueMarkdownListCommand,
      newLine: newLineCommand
    }
  });

  const [caret, setCaret] = useState({ left: 0, top: 0, lineHeight: 20 });
  const [focusIndex, setFocusIndex] = useState(0);
  const [editStatus, setEditStatus] = React.useState<"write" | "preview">(
    "write"
  );
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [mentionState, setMentionState] = useState<MentionState>({
    status: "inactive",
    suggestions: []
  });

  const isPreview = React.useMemo(() => {
    return editStatus === "preview";
  }, [editStatus]);

  let observer: MutationObserver;

  const [height, setHeight] = useState(100);
  const [userResized, setUserResized] = useState(false);

  const focusToCursor = () => {
    const textarea = ref?.current;
    if (textarea) {
      textarea.blur();
      textarea.focus();
    }
  };

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

  const {
    handleSuggestionSelected,
    handleKeyDown,
    handleKeyPress,
    handleKeyUp
  } = getHandlers({
    ref,
    suggestions,
    loadSuggestions,
    setFocusIndex,
    focusIndex,
    setCaret,
    setSuggestions,
    mentionState,
    setMentionState,
    value
  });

  const isEditingText = React.useMemo(() => {
    let v = mentionState.status !== "active";

    if (!suggestions.length) {
      v = true;
    }

    return v;
  }, [mentionState.status, suggestions]);

  const onEnterNewLine = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (isEditingText) {
        commandController.executeCommand(
          "newLineAndIndentContinueMarkdownList"
        );
      }
      focusToCursor();
    }
  };

  return (
    <EditorWrapper theme={themeCSS} disabled={disabled}>
      <EditorHeader
        {...{
          theme: themeCSS,
          editStatus,
          setEditStatus,
          isPreview,
          commandController
        }}
      />
      <Textarea
        ref={ref}
        value={value}
        onChange={event => {
          onChange(event.target.value);
          adjustHeight();
        }}
        onKeyUp={event => {
          handleKeyUp(event);
        }}
        onKeyDown={event => {
          handleKeyDown(event);
          onEnterNewLine(event);
        }}
        onKeyPress={handleKeyPress}
        placeholder=""
        minHeight={minHeight}
        height={height}
        hide={isPreview}
        theme={themeCSS}
      />
      {isPreview && (
        <PreviewWrapper>
          <MarkdownPreviewer
            content={value}
            {...(identifier
              ? { plugins: [renderIdentityOrAddressPlugin(identifier)] }
              : {})}
          />
        </PreviewWrapper>
      )}
      {mentionState.status === "active" && suggestions.length > 0 && (
        <SuggestionsDropdown
          caret={caret}
          suggestions={suggestions}
          focusIndex={focusIndex < suggestions.length ? focusIndex : 0}
          textAreaRef={ref}
          onSuggestionSelected={handleSuggestionSelected}
          suggestionsAutoplace
        />
      )}
    </EditorWrapper>
  );
};

export default Editor;
