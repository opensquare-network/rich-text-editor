import { insertText } from "./text";
import * as React from "react";
import { getCaretCoordinates } from "./index";

export function getHandlers({
                              ref,
                              suggestions,
                              setShowSuggestion,
                              showSuggestion,
                              setFocusIndex,
                              focusIndex,
                              setCaret,
                              isInputtingList, setIsInputtingList,
                              nextListPrefix, setNextListPrefix,
                              lastPressKey, setLastPressKey
                            }) {
  const handleSuggestionSelected = (index: number) => {
    if (suggestions) {
      insertText(ref?.current, suggestions[index].value);
      setShowSuggestion(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestion && suggestions) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setFocusIndex(focusIndex >= suggestions.length - 1 ? 0 : focusIndex + 1);
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setFocusIndex(focusIndex === 0 ? suggestions.length - 1 : focusIndex - 1);
      }
      if (event.key === "Enter") {
        event.preventDefault();
        handleSuggestionSelected(focusIndex);
      }
      if (event.key === "Backspace") {
        setShowSuggestion(false);
      }
    }

    if (event.key === "Enter") {
      if (ref.current) {
        if (lastPressKey === "Enter") {
          return setIsInputtingList(false);
        }
        if (isInputtingList) {
          event.preventDefault();
          setLastPressKey("Enter");
          insertText(ref?.current, `\n${nextListPrefix}`);
          if (parseInt(nextListPrefix) > 0) {
            setNextListPrefix(`${parseInt(nextListPrefix) + 1}. `);
          }
        }
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "@") {
      if (ref.current) {
        setCaret(getCaretCoordinates(ref.current));
      }
      setShowSuggestion(true);
    }
    setLastPressKey(event.key);
  };

  return {
    handleSuggestionSelected,
    handleKeyDown,
    handleKeyPress
  };
}
