import { Suggestion } from "./suggestion";

type CaretCoordinates = {
  top: number;
  left: number;
  lineHeight: number;
};

export type MentionState = {
  status: "active" | "inactive" | "loading";
  /**
   * Selection start by the time the mention was activated
   */
  startPosition?: number;
  focusIndex?: number;
  caret?: CaretCoordinates;
  suggestions: Suggestion[];
  /**
   * The character that triggered the mention. Example: @
   */
  triggeredBy?: string;
};
