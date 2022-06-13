import { insertText } from "../../text/textarea-text-controller";
import { Command } from "../command";

export const newLineCommand: Command = {
  execute(api) {
    const { textApi } = api;
    const { textArea } = textApi;

    if (!textArea) {
      return;
    }

    insertText(textArea, "\n");
  }
};
