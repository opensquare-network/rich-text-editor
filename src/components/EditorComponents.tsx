import styled, { css } from "styled-components";
import * as React from "react";

export const EditorWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  ${(props) =>
          props.theme === "subsquare" &&
          css`
            border: 1px solid #E0E4EB;
          `};
`;

export const ToolBar = styled.div`
  flex-basis: 100%;
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${(props) =>
          props.theme === "subsquare" &&
          css`
            justify-content: end;
            background-color: #F6F7FA;
            padding-left: 0;
            padding-right: 20px;
            height: 40px;
            border-radius: 4px;
            border-bottom: 1px solid #E0E4EB;
            position: relative;
            > div:first-child{
              gap: 0;
              height: 40px;
            }
          `};
  /* mobile */
  @media screen and (max-width: 769px) {
    display: block;
    padding-left: 0;
    padding-right: 0;
  }
`;

export const TabsWrapper = styled.div`
  display: flex;
  gap: 24px;
  height: 48px;
  /* mobile */
  @media screen and (max-width: 769px) {
    border-bottom: 1px solid #E2E8F0;
  }
  ${(props) =>
          props.theme === "subsquare" &&
          css`
            position: absolute;
            left: 0;
            top: 1px;
          `};
`;

interface TabProps {
  active: boolean;
  theme: "opensquare" | "subsquare";
}

export const Tab = styled.button<TabProps>`
  all: unset;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  border-bottom: 3px solid #ffffff;
  ${(props) =>
          props.theme === "subsquare" &&
          css`
            padding: 12px;
            line-height: 16px;
            border-bottom: none;
            color: #9DA9BB;
          `};
  ${(props) =>
          props.active && props.theme === "opensquare" &&
          css`
            border-bottom: 3px solid #04d2c5;
          `};
  ${(props) =>
          props.active && props.theme === "subsquare" &&
          css`
            background-color: white;
            color: #1E2134;
          `};
  cursor: pointer;
  /* mobile */
  @media screen and (max-width: 769px) {
    margin-left: 16px;
    margin-right: 16px;
    width: 50%;
    text-align: center;
  }
`;

interface Props {
  hide?: boolean;
  minHeight?: number;
  height?: number;
  theme?: "opensquare" | "subsquare";
}

export const ToolbarItemsWrapper = styled.div<Props>`
  display: flex;
  align-items: center;
  gap: 8px;
  ${(props) =>
          props.hide &&
          css`
            display: none;
          `};
  /* mobile */
  @media screen and (max-width: 769px) {
    height: 48px;
  }
`;

export const ToolbarButton = styled.button`
  all: unset;
  cursor: pointer;
  width: 24px;
  height: 24px;

  &:hover svg path {
    fill: #1e2134;
  }
`;

export const Textarea = styled.textarea<Props>`
  box-sizing: border-box;
  width: 100%;
  min-height: 144px;
  ${(props) =>
          props.minHeight &&
          css`
            min-height: ${props.minHeight}px;
          `} ;
  ${(props) =>
          props.height &&
          css`
            height: ${props.height}px;
          `} ;
  ${(props) =>
          props.hide &&
          css`
            display: none;
          `};
  max-height: 672px;
  resize: vertical;
  border: none;
  outline: none;
  font-size: 14px;
  line-height: 24px;
  padding: 12px;
  background: #fbfcfe;
  ${(props) =>
          props.theme === "subsquare" &&
          css`
            background-color: white;
          `};
  font-family: Inter, sans-serif;

  ::selection {
    background-color: #E2E8F0;
  }
`;
