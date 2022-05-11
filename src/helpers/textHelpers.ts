import { SelectionRange } from "../types/SelectionRange";
import { TextState } from "../types/CommandOptions";
import { AlterLineFunction } from "./listHelpers";

/**
 * A list of helpers for manipulating markdown text.
 * These helpers do not interface with a textarea. For that, see
 */
export function getSurroundingWord(
  text: string,
  position: number
): SelectionRange {
  if (!text) throw Error("Argument 'text' should be truthy");

  const isWordDelimiter = (c: string) => c === " " || c.charCodeAt(0) === 10;

  // leftIndex is initialized to 0 because if selection is 0, it won't even enter the iteration
  let start = 0;
  // rightIndex is initialized to text.length because if selection is equal to text.length it won't even enter the interation
  let end = text.length;

  // iterate to the left
  for (let i = position; i - 1 > -1; i--) {
    if (isWordDelimiter(text[i - 1])) {
      start = i;
      break;
    }
  }

  // iterate to the right
  for (let i = position; i < text.length; i++) {
    if (isWordDelimiter(text[i])) {
      end = i;
      break;
    }
  }

  return { start, end };
}

/**
 * If the cursor is inside a word and (selection.start === selection.end)
 * returns a new Selection where the whole word is selected
 * @param text
 * @param selection
 */
export function selectWord({ text, selection }: TextState): SelectionRange {
  if (text && text.length && selection.start === selection.end) {
    // the user is pointing to a word
    return getSurroundingWord(text, selection.start);
  }
  return selection;
}

/**
 *  Gets the number of line-breaks that would have to be inserted before the given 'startPosition'
 *  to make sure there's an empty line between 'startPosition' and the previous text
 */
export function getBreaksNeededForEmptyLineBefore(
  text = "",
  startPosition: number
): number {
  if (startPosition === 0) return 0;

  // rules:
  // - If we're in the first line, no breaks are needed
  // - Otherwise there must be 2 breaks before the previous character. Depending on how many breaks exist already, we
  //      may need to insert 0, 1 or 2 breaks

  let neededBreaks = 2;
  let isInFirstLine = true;
  for (let i = startPosition - 1; i >= 0 && neededBreaks >= 0; i--) {
    switch (text.charCodeAt(i)) {
      case 32: // blank space
        continue;
      case 10: // line break
        neededBreaks--;
        isInFirstLine = false;
        break;
      default:
        return neededBreaks;
    }
  }
  return isInFirstLine ? 0 : neededBreaks;
}

/**
 *  Gets the number of line-breaks that would have to be inserted after the given 'startPosition'
 *  to make sure there's an empty line between 'startPosition' and the next text
 */
export function getBreaksNeededForEmptyLineAfter(
  text = "",
  startPosition: number
) {
  if (startPosition === text.length - 1) return 0;

  // rules:
  // - If we're in the first line, no breaks are needed
  // - Otherwise there must be 2 breaks before the previous character. Depending on how many breaks exist already, we
  //      may need to insert 0, 1 or 2 breaks

  let neededBreaks = 2;
  let isInLastLine = true;
  for (let i = startPosition; i < text.length && neededBreaks >= 0; i++) {
    switch (text.charCodeAt(i)) {
      case 32:
        continue;
      case 10: {
        neededBreaks--;
        isInLastLine = false;
        break;
      }
      default:
        return neededBreaks;
    }
  }
  return isInLastLine ? 0 : neededBreaks;
}
export function getSelectedText(textSection: TextState): string {
  return textSection.text.slice(
    textSection.selection.start,
    textSection.selection.end
  );
}
export function getCharactersBeforeSelection(
  textState: TextState,
  characters: number
): string {
  return textState.text.slice(
    textState.selection.start - characters,
    textState.selection.start
  );
}

export function getCharactersAfterSelection(
  textState: TextState,
  characters: number
): string {
  return textState.text.slice(
    textState.selection.end,
    textState.selection.end + characters
  );
}

/**
 * Inserts insertionString before each line
 */
export function insertBeforeEachLine(
  selectedText: string,
  insertBefore: string | AlterLineFunction
): { modifiedText: string; insertionLength: number } {
  const lines = selectedText.split(/\n/);

  let insertionLength = 0;
  const modifiedText = lines
    .map((item, index) => {
      if (typeof insertBefore === "string") {
        insertionLength += insertBefore.length;
        return insertBefore + item;
      } else if (typeof insertBefore === "function") {
        const insertionResult = insertBefore(item, index);
        insertionLength += insertionResult.length;
        return insertBefore(item, index) + item;
      }
      throw Error("insertion is expected to be either a string or a function");
    })
    .join("\n");

  return { modifiedText, insertionLength };
}
