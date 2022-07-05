import * as React from "react";
import { ReactElement } from "react";

export interface Suggestion {
  preview: React.ReactNode;
  value: string;
}

export type DemoProps = {
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
  theme?: "opensquare" | "subsquare";
  loadSuggestions?: (text: string) => Suggestion[];
  disabled?: boolean;
  identifier?: ReactElement;
};

export interface CaretCoordinates {
  top: number;
  left: number;
  lineHeight: number;
}

export interface MentionState {
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
}