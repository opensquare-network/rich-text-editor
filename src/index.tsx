// Individual commands
import { boldCommand } from "./commands/markdown-commands/boldCommand";
import { italicCommand } from "./commands/markdown-commands/italicCommand";
import { strikethroughCommand } from "./commands/markdown-commands/strikethroughCommand";
import { linkCommand } from "./commands/markdown-commands/linkCommand";
import { quoteCommand } from "./commands/markdown-commands/quoteCommand";
import { imageCommand } from "./commands/markdown-commands/imageCommand";
import { CommandController } from "./commands/command-controller";
import type { TextController } from "./types/CommandOptions";
import { TextAreaTextController } from "./text/textarea-text-controller";
import * as textHelpers from "./helpers/textHelpers";
import * as listHelpers from "./helpers/listHelpers";
import * as headerHelpers from "./helpers/headerHelpers";
import { codeCommand } from "./commands/markdown-commands/codeCommand";
import { useTextAreaMarkdownEditor } from "./hooks/use-markdown-editor";
import { codeBlockCommand } from "./commands/markdown-commands/codeBlockCommand";
import { checkedListCommand } from "./commands/markdown-commands/checkedListCommand";
import { orderedListCommand } from "./commands/markdown-commands/orderedListCommand";
import { unorderedListCommand } from "./commands/markdown-commands/unorderedListCommand";
import { underlineCommand } from "./commands/markdown-commands/underlineCommand";
import * as React from "react";
import { MarkdownPreview } from "./components/MarkdownPreview";
import Bold from "./icons/bold";
import Code from "./icons/code";
import Delete from "./icons/delete";
import Img from "./icons/img";
import Link from "./icons/link";
import Ol from "./icons/ol";
import Ul from "./icons/ul";
import Underline from "./icons/underline";
import { SuggestionsDropdown } from "./components/SuggestionsDropdown";
import { getCaretCoordinates } from "./util";
import { useRef, useState } from "react";
import { insertText } from "./util/text";
import {
  EditorWrapper,
  Tab,
  TabsWrapper, Textarea,
  ToolBar,
  ToolbarButton,
  ToolbarItemsWrapper
} from "./components/EditorComponents";

export {
  // helpers
  textHelpers,
  listHelpers,
  headerHelpers,
  // controllers
  CommandController,
  TextController,
  TextAreaTextController,
  // commands
  boldCommand,
  italicCommand,
  strikethroughCommand,
  linkCommand,
  quoteCommand,
  codeCommand,
  codeBlockCommand,
  checkedListCommand,
  orderedListCommand,
  unorderedListCommand,
  imageCommand,
  // hooks
  useTextAreaMarkdownEditor
};

export type DemoProps = {};

const suggestions = [{
  preview: <span>abc</span>,
  value: "abc"
},
  {
    preview: <span>edf</span>,
    value: "edf"
  }];

export const Editor: React.FunctionComponent<DemoProps> = () => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const { commandController } = useTextAreaMarkdownEditor(ref,{
    commandMap: {
      bold: boldCommand,
      delete: strikethroughCommand,
      code: codeCommand,
      image: imageCommand,
      link: linkCommand,
      ol: orderedListCommand,
      ul: unorderedListCommand,
      underline: underlineCommand
    }
  });

  const [mdString, setMdString] = React.useState("");
  const [caret, setCaret] = useState({ left: 0, top: 0, lineHeight: 20 });
  const [showSuggestion, setShowSuggestion] = React.useState<boolean>(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const [editStatus, setEditStatus] = React.useState<"write" | "preview">(
    "write"
  );
  const isPreview = React.useMemo(() => {
    return editStatus === "preview";
  }, [editStatus]);

  const handleSuggestionSelected =(index:number) => {
    insertText(ref?.current, suggestions[index].value);
    setShowSuggestion(false);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if(showSuggestion){
      if (event.key==="ArrowDown"){
        event.preventDefault();
        setFocusIndex(focusIndex >= suggestions.length-1 ? 0 : focusIndex+1 );
      }
      if (event.key==="ArrowUp"){
        event.preventDefault();
        setFocusIndex(focusIndex === 0 ? suggestions.length-1 : focusIndex-1);
      }
      if(event.key==="Enter"){
        event.preventDefault();
        handleSuggestionSelected(focusIndex);
      }
      if (event.key === "Backspace") {
        setShowSuggestion(false);
      }
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "@") {
      if (ref.current) {
        setCaret(getCaretCoordinates(ref.current));
      }
      setShowSuggestion(true);
    }
  }

  return (
      <EditorWrapper>
        <ToolBar>
          <TabsWrapper>
            <Tab
              active={editStatus === "write"}
              onClick={() => setEditStatus("write")}
            >
              Write
            </Tab>
            <Tab
              active={editStatus === "preview"}
              onClick={() => setEditStatus("preview")}
            >
              Preview
            </Tab>
          </TabsWrapper>
          <ToolbarItemsWrapper hide={isPreview}>
            <ToolbarButton
              onClick={async () => {
                await commandController.executeCommand("bold");
              }}
            >
              <Bold/>
            </ToolbarButton>
            <ToolbarButton
              onClick={async () => {
                await commandController.executeCommand("underline");
              }}
            >
              <Underline/>
            </ToolbarButton>
            <ToolbarButton
              onClick={async () => {
                await commandController.executeCommand("delete");
              }}
            >
              <Delete/>
            </ToolbarButton>
            <ToolbarButton
              onClick={async () => {
                await commandController.executeCommand("ul");
              }}
            >
              <Ul/>
            </ToolbarButton>
            <ToolbarButton
              onClick={async () => {
                await commandController.executeCommand("ol");
              }}
            >
              <Ol/>
            </ToolbarButton>
            <ToolbarButton
              onClick={async () => {
                await commandController.executeCommand("link");
              }}
            >
              <Link/>
            </ToolbarButton>
            <ToolbarButton
              onClick={async () => {
                await commandController.executeCommand("image");
              }}
            >
              <Img/>
            </ToolbarButton>
            <ToolbarButton
              onClick={async () => {
                await commandController.executeCommand("code");
              }}
            >
              <Code/>
            </ToolbarButton>
          </ToolbarItemsWrapper>
        </ToolBar>

        <Textarea
          hide={isPreview}
          ref={ref}
          value={mdString}
          onChange={event => setMdString(event.target.value)}
          onKeyDown={handleKeyDown}
          onKeyPress={handleKeyPress}
          placeholder="Please text here..."
        />

        {isPreview && <MarkdownPreview content={mdString} />}
        {
          showSuggestion && <SuggestionsDropdown
            caret={caret}
            suggestions={suggestions}
            focusIndex={focusIndex}
            textAreaRef={ref}
            onSuggestionSelected={handleSuggestionSelected}
            suggestionsAutoplace
          />
        }
      </EditorWrapper>
  );
};

export default Editor;
