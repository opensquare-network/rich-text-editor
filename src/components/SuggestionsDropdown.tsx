import * as React from "react";
import styled from "styled-components";
import { Suggestion } from "../index";

const SuggestionsWrapper = styled.ul`
  position: absolute;
  min-width: 180px;
  padding: 16px;
  margin: 20px 0 0;
  list-style: none;
  cursor: pointer;
  background: #fff;
  border: 1px solid #c8ccd0;
  border-radius: 3px;
  box-shadow: 0 1px 5px rgba(27, 31, 35, .15);
  color: #506176;

  li {
    padding: 4px 8px;

    &:first-child {
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
    }

    &:last-child {
      border-bottom-right-radius: 2px;
      border-bottom-left-radius: 2px;
    }

    &:hover, &[aria-selected=true] {
      color: #1E2134;
    }
  }
`;

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
    // @ts-ignore
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
    <SuggestionsWrapper style={style}>
      {suggestions.map((s, i) => (
        <li
          onClick={handleSuggestionClick}
          onMouseDown={handleMouseDown}
          key={i}
          aria-selected={focusIndex === i ? "true" : "false"}
          data-index={`${i}`}
        >
          {s.preview}
        </li>
      ))}
    </SuggestionsWrapper>
  );
};
