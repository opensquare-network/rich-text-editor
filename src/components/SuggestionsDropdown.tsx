import * as React from "react";
import styled from "styled-components";
import { Suggestion } from "../index";

const SuggestionsWrapper = styled.ul`
  position: absolute;
  min-width: 180px;
  max-height: 110px;
  overflow-y: scroll;
  //todo: make arrow key can scroll the list
  padding: 8px 0;
  margin: 20px 0 0;
  list-style: none;
  cursor: pointer;
  background: #fff;
  box-shadow: 0px 4px 31px rgba(26, 33, 44, 0.06),
    0px 0.751293px 8px rgba(26, 33, 44, 0.04);
  color: #506176;

  li {
    padding: 6px 16px;

    &:hover,
    &[aria-selected="true"] {
      background-color: #f0f3f8;
    }
  }
`;

interface ClassArray extends Array<ClassValue> {} // tslint:disable-line no-empty-interface

interface ClassDictionary {
  [id: string]: string | boolean;
}

interface CaretCoordinates {
  top: number;
  left: number;
  lineHeight: number;
}

type ClassValue = string | ClassDictionary | ClassArray | undefined | null;

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

  const left = caret.left - (textAreaRef?.current?.scrollLeft ?? 0) + 30;
  const top = caret.top - (textAreaRef?.current?.scrollTop ?? 0) + 60;

  const style: React.CSSProperties = {};
  style.top = top;

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
