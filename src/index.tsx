// Individual commands
import { headingLevel1Command } from "./commands/markdown-commands/headingLevel1Command";
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
import { headingLevel2Command } from "./commands/markdown-commands/headingLevel2Command";
import { headingLevel3Command } from "./commands/markdown-commands/headingLevel3Command";
import { headingLevel4Command } from "./commands/markdown-commands/headingLevel4Command";
import { headingLevel5Command } from "./commands/markdown-commands/headingLevel5Command";
import { headingLevel6Command } from "./commands/markdown-commands/headingLevel6Command";
import * as React from "react";
import {
  Box,
  Button,
  ChakraProvider,
  HStack,
  Spacer,
  Textarea
} from "@chakra-ui/react";
import { ToolbarButton } from "../demo/toolbar-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faCode,
  faHeading,
  faItalic
} from "@fortawesome/free-solid-svg-icons";
import ReactDOM from "react-dom";
import MarkdownPreview from "./components/MarkdownPreview";

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
  headingLevel1Command,
  headingLevel2Command,
  headingLevel3Command,
  headingLevel4Command,
  headingLevel5Command,
  headingLevel6Command,
  // hooks
  useTextAreaMarkdownEditor
};

export type DemoProps = {};

export const Editor: React.FunctionComponent<DemoProps> = () => {
  const { ref, commandController } = useTextAreaMarkdownEditor({
    commandMap: {
      bold: boldCommand,
      italic: italicCommand,
      code: codeCommand,
      headingLevel1: headingLevel1Command
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
      <Box p={3}>
        <HStack py={2}>
          <Button onClick={() => setEditStatus("write")}>Write</Button>
          <Button onClick={() => setEditStatus("preview")}>Preview</Button>
          <Spacer />
          <ToolbarButton
            onClick={async () => {
              await commandController.executeCommand("bold");
            }}
          >
            <FontAwesomeIcon icon={faBold} />
          </ToolbarButton>
          <ToolbarButton
            onClick={async () => {
              await commandController.executeCommand("italic");
            }}
          >
            <FontAwesomeIcon icon={faItalic} />
          </ToolbarButton>
          <ToolbarButton
            onClick={async () => {
              await commandController.executeCommand("code");
            }}
          >
            <FontAwesomeIcon icon={faCode} />
          </ToolbarButton>
          <ToolbarButton
            onClick={async () => {
              await commandController.executeCommand("headingLevel1");
            }}
          >
            <FontAwesomeIcon icon={faHeading} />
          </ToolbarButton>
        </HStack>

        <Textarea
          ref={ref}
          value={mdString}
          style={{ display: !isPreview ? "block" : "none" }}
          onChange={e => setMdString(e.target.value)}
          placeholder="osn markdown editor"
          fontFamily={"monospace"}
        />

        {isPreview && <MarkdownPreview content={mdString} />}
      </Box>
    </ChakraProvider>
  );
};

ReactDOM.render(<Editor />, document.getElementById("root"));

export default Editor;
