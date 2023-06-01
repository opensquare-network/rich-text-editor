import * as React from "react";
import { Command } from "../command";
import {
  getCharactersAfterSelection,
  getCharactersBeforeSelection,
  getSelectedText,
  selectWord,
} from "../../helpers/textHelpers";

export const underlineCommand: Command = {
  shouldUndo: options => {
    return (
      getCharactersBeforeSelection(options.initialState, 5) === "<ins>" &&
      getCharactersAfterSelection(options.initialState, 6) === "</ins>"
    );
  },
  execute: ({ initialState, textApi }) => {
    // Adjust the selection to encompass the whole word if the caret is inside one
    const newSelectionRange = selectWord({
      text: initialState.text,
      selection: initialState.selection,
    });
    const state1 = textApi.setSelectionRange(newSelectionRange);
    // Replaces the current selection with the bold mark up
    const state2 = textApi.replaceSelection(`<ins>${getSelectedText(state1)}</ins>`);
    // Adjust the selection to not contain the **
    textApi.setSelectionRange({
      start: state2.selection.end - 5 - getSelectedText(state1).length,
      end: state2.selection.end - 6,
    });
  },
  undo: ({ initialState, textApi }) => {
    const text = getSelectedText(initialState);
    textApi.setSelectionRange({
      start: initialState.selection.start - 5,
      end: initialState.selection.end + 6,
    });
    textApi.replaceSelection(text);
    textApi.setSelectionRange({
      start: initialState.selection.start - 5,
      end: initialState.selection.end - 6,
    });
  },
};
