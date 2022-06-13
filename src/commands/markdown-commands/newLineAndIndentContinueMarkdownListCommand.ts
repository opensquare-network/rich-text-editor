// https://github.com/codemirror/codemirror5/blob/master/addon/edit/continuelist.js
import { insertText } from "../../text/textarea-text-controller";
import { Command } from "../command";
import { newLineCommand } from "./newLineCommand";

const listRE = /^(\s*)(>[> ]*|[*+-] \[[x ]\]\s|[*+-]\s|(\d+)([.)]))(\s*)/;
const emptyListRE = /^(\s*)(>[> ]*|[*+-] \[[x ]\]|[*+-]|(\d+)[.)])(\s*)$/;
const unorderedListRE = /[*+-]\s/;

export const newLineAndIndentContinueMarkdownListCommand: Command = {
  execute(api) {
    const newLine = () => newLineCommand.execute(api);

    const { initialState: state, textApi } = api;
    const { textArea } = textApi;
    if (!textArea) {
      return;
    }

    const { lineText: line } = state;

    const inList = listRE.exec(line);

    if (!inList) {
      newLine();
      return;
    }

    const match = listRE.exec(line);

    if (!match) {
      return;
    }

    if (emptyListRE.test(line)) {
      const focusIndex = state.selection.end;
      const listPrefix = match[0];
      textApi.setSelectionRange({
        start: focusIndex - listPrefix.length - 1,
        end: focusIndex
      });
      insertText(textArea, "\n");
    } else {
      const indent = match[1];
      const after = match[5];

      const numbered = !(
        unorderedListRE.test(match[2]) || match[2].indexOf(">") >= 0
      );
      const bullet = numbered
        ? parseInt(match[3], 10) + 1 + match[4]
        : match[2].replace("x", " ");

      insertText(textArea, "\n" + indent + bullet + after);

      // TODO: re-calculate the rest numbered list
      if (numbered) {
      }
    }
  }
};
