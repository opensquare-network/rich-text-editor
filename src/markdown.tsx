import * as React from "react";
import Opensquare from "./styles/opensquare";
import Subsqaure from "./styles/subsqaure";
import { useEffect, useRef, useState } from "react";
import { useTextAreaMarkdownEditor } from "./hooks/useMarkdownEditor";
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
  renderMentionIdentityUserPlugin,
  Plugin as PreviewerPlugin,
} from "@osn/previewer";
import { SuggestionsDropdown } from "./components/SuggestionsDropdown";
import { Suggestion } from "./types/suggestion";
import { MentionState } from "./types/state";

interface Props {
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
  theme?: "opensquare" | "subsquare";
  loadSuggestions?: (text: string) => Suggestion[];
  disabled?: boolean;
  identifier?: React.ReactElement;
  setActive: (active: boolean) => void;
  /**
   * @see https://github.com/opensquare-network/previewer
   * @description \@osn/previewer component plugins
   */
  previewerPlugins?: PreviewerPlugin[];
  onChangePreviewMode?: (isPreview: boolean) => void;
}

export default function MarkdownEditor({
  value,
  onChange,
  loadSuggestions,
  minHeight = 144,
  theme = "opensquare",
  disabled = false,
  identifier,
  setActive = () => {},
  previewerPlugins = [],
  onChangePreviewMode = () => {},
}: Props) {
  const themeCSS = theme === "opensquare" ? Opensquare : Subsqaure;
  const ref = useRef<HTMLTextAreaElement>(null);
  const refPreview = useRef<HTMLDivElement>(null);
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
      newLine: newLineCommand,
    },
  });

  const [caret, setCaret] = useState({ left: 0, top: 0, lineHeight: 20 });
  const [focusIndex, setFocusIndex] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [mentionState, setMentionState] = useState<MentionState>({
    status: "inactive",
    suggestions: [],
  });

  useEffect(() => {
    if (ref.current) {
      const textarea = ref.current;
      textarea.onfocus = () => {
        setActive(true);
      };
      textarea.onblur = () => {
        setActive(false);
      };
    }
  }, [ref]);

  useEffect(() => {
    setMentionState({ ...mentionState, status: "inactive" });
  }, [isPreview]);

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
    //shrink height
    if (value === "") {
      adjustHeight();
    }
  }, [value]);

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
      observer = new MutationObserver((record) => {
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
        attributeFilter: ["style"],
      });
    }
    if (value === "") {
      setIsPreview(false);
    }
  }, [height, value, setHeight]);

  useEffect(() => {
    onChangePreviewMode(isPreview);
  }, [isPreview]);

  const {
    handleSuggestionSelected,
    handleKeyDown,
    handleKeyPress,
    handleKeyUp,
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
    value,
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
          "newLineAndIndentContinueMarkdownList",
        );
      }
      focusToCursor();
    }
  };

  return (
    <EditorWrapper $theme={themeCSS} disabled={disabled}>
      <EditorHeader
        $theme={themeCSS}
        isPreview={isPreview}
        setIsPreview={setIsPreview}
        commandController={commandController}
      />
      <Textarea
        ref={ref}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          adjustHeight();
        }}
        onKeyUp={(event) => {
          handleKeyUp(event);
        }}
        onKeyDown={(event) => {
          handleKeyDown(event);
          onEnterNewLine(event);
        }}
        onKeyPress={handleKeyPress}
        placeholder=""
        $minHeight={minHeight}
        $height={height}
        $hide={isPreview}
        $theme={themeCSS}
      />
      {isPreview && (
        <PreviewWrapper ref={refPreview}>
          <MarkdownPreviewer
            content={value}
            plugins={
              [
                identifier && renderMentionIdentityUserPlugin(identifier),
                ...previewerPlugins,
              ].filter(Boolean) as PreviewerPlugin[]
            }
            minHeight={minHeight - 20}
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
}
