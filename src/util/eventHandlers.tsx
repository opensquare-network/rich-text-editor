import { insertText } from "./text";
import * as React from "react";
import { getCaretCoordinates } from "./index";

export function getHandlers({
  ref,
  loadSuggestions,
  setFocusIndex,
  focusIndex,
  setCaret,
  suggestions,
  setSuggestions,
  mentionState,
  setMentionState,
  value,
}: any) {
  const handleSuggestionSelected = (index: number) => {
    if (suggestions?.length) {
      ref.current.setSelectionRange(
        mentionState.startPosition - 1,
        ref.current.selectionStart,
      );
      insertText(ref?.current, suggestions[index].value);
      setMentionState({ ...mentionState, status: "inactive" });
      setFocusIndex(0);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mentionState.status === "active") {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setFocusIndex(
          focusIndex >= suggestions.length - 1 ? 0 : focusIndex + 1,
        );
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setFocusIndex(
          focusIndex === 0 ? suggestions.length - 1 : focusIndex - 1,
        );
      }
      if (event.key === "Enter") {
        event.preventDefault();
        handleSuggestionSelected(focusIndex);
      }
      if (event.key === "Backspace") {
        if (ref.current.selectionStart <= mentionState.startPosition) {
          setMentionState({ ...mentionState, status: "inactive" });
          setFocusIndex(0);
        }
      }
      if (event.key === "Escape") {
        setMentionState({ ...mentionState, status: "inactive" });
        setFocusIndex(0);
      }
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { key } = event;
    switch (mentionState.status) {
      case "active":
        if (key === "Backspace") {
          const searchText = value.substr(
            mentionState.startPosition,
            ref.current.selectionStart - mentionState.startPosition,
          );
          setSuggestions(loadSuggestions(searchText));
        }
        break;
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { key } = event;
    if (key === "@") {
      if (ref.current) {
        setCaret(getCaretCoordinates(ref.current));
      }
      setSuggestions(loadSuggestions(""));
      setMentionState({
        status: "active",
        startPosition: ref.current.selectionStart + 1,
      });
    }
    switch (mentionState.status) {
      case "loading":
      case "active":
        if (key === " ") {
          setMentionState({
            ...mentionState,
            status: "inactive",
          });
          return;
        }

        const searchText =
          value.substr(
            mentionState.startPosition,
            ref.current.selectionStart - mentionState.startPosition,
          ) + key;
        // In this case, the mentions box was open but the user typed something else
        setSuggestions(loadSuggestions(searchText));
        break;
      case "inactive":
        if (
          key !== "@" ||
          !/\s|\(|\[|^.{0}$/.test(value.charAt(ref.current.selectionStart - 1))
        ) {
          return;
        }
        loadSuggestions("~");
        break;
    }
  };

  return {
    handleSuggestionSelected,
    handleKeyDown,
    handleKeyPress,
    handleKeyUp,
  };
}
