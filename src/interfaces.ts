import * as React from "react";
import { ReactElement } from "react";
import { Plugin as PreviewerPlugin } from "@osn/previewer";

export interface Suggestion {
  preview: React.ReactNode;
  value: string;
  address: string;
}

export type DemoProps = {
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
  theme?: "opensquare" | "subsquare";
  loadSuggestions?: (text: string) => Suggestion[];
  disabled?: boolean;
  identifier?: ReactElement;
  setActive: (active: boolean) => void;
  previewerPlugins?: PreviewerPlugin[];
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
