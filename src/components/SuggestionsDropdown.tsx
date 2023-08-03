import * as React from "react";
import styled from "styled-components";
import { Suggestion } from "../types/suggestion";

const SuggestionsWrapper = styled.ul`
  position: absolute;
  min-width: 180px;
  padding: 8px 0;
  margin: 20px 0 0;
  list-style: none;
  cursor: pointer;
  background: #fff;
  box-shadow: 0px 4px 31px rgba(26, 33, 44, 0.06),
    0px 0.751293px 8px rgba(26, 33, 44, 0.04);
  color: var(--textSecondary, #506176);
  border-radius: 4px;
  overflow: hidden;

  li {
    padding: 6px 16px;

    &:hover,
    &[aria-selected="true"] {
      background-color: var(--neutral200, #f6f7fa);
    }
  }
`;

interface ClassDictionary {
  [id: string]: string | boolean;
}

interface CaretCoordinates {
  top: number;
  left: number;
  lineHeight: number;
}

type ClassValue = string | ClassDictionary | undefined | null;

export interface SuggestionsDropdownProps {
  classes?: ClassValue | ClassValue[];
  caret: CaretCoordinates;
  suggestions: Suggestion[];
  suggestionsAutoplace: boolean;
  onSuggestionSelected: (index: number) => void;
  /**
   * Which item is focused by the keyboard
   */
  focusIndex: number;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  max?: number;
}

export const SuggestionsDropdown: React.FunctionComponent<
  SuggestionsDropdownProps
> = ({
  suggestions,
  caret,
  onSuggestionSelected,
  suggestionsAutoplace,
  focusIndex,
  textAreaRef,
  max = 5,
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
    window.innerWidth || 0,
  );

  const left = caret.left - (textAreaRef?.current?.scrollLeft ?? 0) + 20;
  const top = caret.top - (textAreaRef?.current?.scrollTop ?? 0) + 45;

  const style: React.CSSProperties = {};
  style.top = top;

  if (
    suggestionsAutoplace &&
    left + (textAreaRef?.current?.getBoundingClientRect()?.left ?? 0) > vw / 2
  )
    style.right = (textAreaRef?.current?.offsetWidth ?? 0) - left;
  else style.left = left;

  return (
    <SuggestionsWrapper className="mention-list" style={style}>
      {suggestions.slice(0, max).map((s, i) => (
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
