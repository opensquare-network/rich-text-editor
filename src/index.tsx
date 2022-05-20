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
import { ChakraProvider } from "@chakra-ui/react";
import { ToolbarButton } from "../demo/toolbar-button";
import ReactDOM from "react-dom";
import { MarkdownPreview } from "./components/MarkdownPreview";
import styles from "./styles/editor.module.css";
import Bold from "./icons/bold.svg";
import Code from "./icons/code.svg";
import Delete from "./icons/delete.svg";
import Img from "./icons/img.svg";
import Link from "./icons/link.svg";
import Ol from "./icons/ol.svg";
import Ul from "./icons/ul.svg";
import Underline from "./icons/underline.svg";

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

const ToolBar: React.FC<DemoProps> = props => {
  return <div className={styles.toolbar}>{props.children}</div>;
};

const Tab: React.FC<{ onClick: () => void; className: string }> = props => {
  return (
    <button
      onClick={props.onClick}
      className={`${styles.tab} ${props.className}`}
    >
      {props.children}
    </button>
  );
};

export const Editor: React.FunctionComponent<DemoProps> = () => {
  const { ref, commandController } = useTextAreaMarkdownEditor({
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
  const [editStatus, setEditStatus] = React.useState<"write" | "preview">(
    "write"
  );
  const isPreview = React.useMemo(() => {
    return editStatus === "preview";
  }, [editStatus]);

  return (
    <ChakraProvider>
      <div className={styles.editorWrapper}>
        <ToolBar>
          <div className={styles.tabs}>
            <Tab
              className={editStatus === "write" ? styles.active : ""}
              onClick={() => setEditStatus("write")}
            >
              Write
            </Tab>
            <Tab
              className={editStatus === "preview" ? styles.active : ""}
              onClick={() => setEditStatus("preview")}
            >
              Preview
            </Tab>
          </div>
          <div
            className={`${styles.toolbarItems} ${
              isPreview ? styles.hidden : ""
            }`}
          >
            <ToolbarButton
              onClick={async () => {
                await commandController.executeCommand("bold");
              }}
            >
              <img src={Bold} alt="" />
            </ToolbarButton>
            <ToolbarButton
              onClick={async () => {
                await commandController.executeCommand("underline");
              }}
            >
              <img src={Underline} alt="" />
            </ToolbarButton>
            <ToolbarButton
              onClick={async () => {
                await commandController.executeCommand("delete");
              }}
            >
              <img src={Delete} alt="" />
            </ToolbarButton>
            <ToolbarButton
              onClick={async () => {
                await commandController.executeCommand("ul");
              }}
            >
              <img src={Ul} alt="" />
            </ToolbarButton>
            <ToolbarButton
              onClick={async () => {
                await commandController.executeCommand("ol");
              }}
            >
              <img src={Ol} alt="" />
            </ToolbarButton>
            <ToolbarButton
              onClick={async () => {
                await commandController.executeCommand("link");
              }}
            >
              <img src={Link} alt="" />
            </ToolbarButton>
            <ToolbarButton
              onClick={async () => {
                await commandController.executeCommand("image");
              }}
            >
              <img src={Img} alt="" />
            </ToolbarButton>
            <ToolbarButton
              onClick={async () => {
                await commandController.executeCommand("code");
              }}
            >
              <img src={Code} alt="" />
            </ToolbarButton>
          </div>
        </ToolBar>

        <textarea
          className={`${styles.textarea} ${isPreview ? styles.hidden : ""}`}
          ref={ref}
          value={mdString}
          onChange={e => setMdString(e.target.value)}
          placeholder="Please text here..."
        />

        {isPreview && <MarkdownPreview content={mdString} />}
      </div>
    </ChakraProvider>
  );
};

ReactDOM.render(<Editor />, document.getElementById("root"));

export default Editor;
