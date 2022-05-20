import * as React from "react";

import styles from "../styles/editor.module.scss";

interface ClassArray extends Array<ClassValue> {
} // tslint:disable-line no-empty-interface

interface ClassDictionary {
  [id: string]: string | boolean;
}

interface CaretCoordinates {
  top: number,
  left: number,
  lineHeight: number
}

interface Suggestion {
  /**
   * React element to be used as the preview
   */
  preview: React.ReactNode,
  /**
   * Value that is going to be used in the text in case this suggestion is selected
   */
  value: string
}


type ClassValue =
  | string
  | ClassDictionary
  | ClassArray
  | undefined
  | null;

export interface SuggestionsDropdownProps {
  classes?: ClassValue;
  caret: CaretCoordinates;
  suggestions: Suggestion[];
  suggestionsAutoplace: boolean;
  onSuggestionSelected: (index: number) => void;
  /**
   * Which item is focused by the keyboard
   */
  focusIndex: number;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
}

export const SuggestionsDropdown: React.FunctionComponent<SuggestionsDropdownProps> = ({
                                                                                         suggestions,
                                                                                         caret,
                                                                                         onSuggestionSelected,
                                                                                         suggestionsAutoplace,
                                                                                         focusIndex,
                                                                                         textAreaRef
                                                                                       }) => {
  const handleSuggestionClick = (event: React.MouseEvent) => {
    event.preventDefault();
    const index = parseInt(event.currentTarget.attributes["data-index"].value);
    onSuggestionSelected(index);
  };

  const handleMouseDown = (event: React.MouseEvent) => event.preventDefault();

  const vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  const vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );

  const left = caret.left - (textAreaRef?.current?.scrollLeft ?? 0) + 20;
  const top = caret.top - (textAreaRef?.current?.scrollTop ?? 0) + 50;

  const style: React.CSSProperties = {};
  if (
    suggestionsAutoplace &&
    top + (textAreaRef?.current?.getBoundingClientRect()?.top ?? 0) > vh / 2
  )
    style.bottom = (textAreaRef?.current?.offsetHeight ?? 0) - top;
  else style.top = top;

  if (
    suggestionsAutoplace &&
    left + (textAreaRef?.current?.getBoundingClientRect()?.left ?? 0) > vw / 2
  )
    style.right = (textAreaRef?.current?.offsetWidth ?? 0) - left;
  else style.left = left;

  return (
    <ul className={styles.mdeSuggestions} style={style}>
      {suggestions.map((s, i) => (
        <li
          className={styles.mdeSuggestion}
          onClick={handleSuggestionClick}
          onMouseDown={handleMouseDown}
          key={i}
          aria-selected={focusIndex === i ? "true" : "false"}
          data-index={`${i}`}
        >
          {s.preview}
        </li>
      ))}
    </ul>
  );
};