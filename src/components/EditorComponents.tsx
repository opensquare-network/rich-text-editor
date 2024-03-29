import styled, { css } from "styled-components";
import { ThemeCss } from "../types";

interface WrapperProps {
  disabled?: boolean;
  $theme: ThemeCss;
}

export const EditorWrapper = styled.div<WrapperProps>`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  border-top: 1px solid var(--strokeActionDefault, #e2e8f0);
  ${(props) => props.$theme.wrapper};
  ${(p) =>
    p.disabled &&
    css`
      pointer-events: none;
      cursor: not-allowed;
    `}
`;

type ToolbarProps = {
  $isPreview?: boolean;
  $theme: ThemeCss;
};
export const ToolBar = styled.div<ToolbarProps>`
  border-radius: var(--editor-radius) var(--editor-radius) 0 0;
  flex-basis: 100%;
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;
  /* mobile */
  @media screen and (max-width: 769px) {
    display: block;
    padding-left: 0;
    padding-right: 0;
    ${(props) =>
      props.$isPreview &&
      css`
        padding-top: 0 !important;
      `};
  }
  ${(props) => props.$theme.toolbar};
`;

interface TabProps {
  $active: boolean;
  $theme: ThemeCss;
}

export const Tab = styled.button<TabProps>`
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  border: none;
  background-color: transparent;
  border-bottom: 3px solid transparent;
  ${(props) => props.$theme.tab};
  ${(props) =>
    props.$active &&
    css`
      border-bottom: 3px solid var(--strokeBgBrandSecondary, #04d2c5);
    `};
  ${(props) => props.$active && props.$theme.tabActive};
  cursor: pointer;
  /* mobile */
  @media screen and (max-width: 769px) {
    margin-left: 16px;
    margin-right: 16px;
    width: 50%;
    text-align: center;
    ${(props) => props.$theme.tabMobile};
  }
`;

type TabsWrapperProps = {
  $theme: ThemeCss;
};
export const TabsWrapper = styled.div<TabsWrapperProps>`
  display: flex;
  gap: 24px;
  height: 40px;
  /* mobile */
  @media screen and (max-width: 769px) {
    width: 100%;
  }
  ${(props) => props.$theme.tabs};

  ${Tab}:first-child {
    border-radius: var(--editor-radius) 0 0 0;
  }
`;

interface Props {
  $hide?: boolean;
  $minHeight?: number;
  $height?: number;
  $theme?: ThemeCss;
}

export const ToolbarItemsWrapper = styled.div<Props>`
  display: flex;
  align-items: center;
  gap: 8px;
  ${(props) =>
    props.$hide &&
    css`
      display: none;
    `};
  /* mobile */
  @media screen and (max-width: 769px) {
    height: 40px;
  }
`;

export const ToolbarButton = styled.button`
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  svg {
    width: 100%;
    height: 100%;
  }

  &:hover svg path {
    fill: var(--textPrimary, #1e2134);
  }
`;

export const Textarea = styled.textarea<Props>`
  color: var(--textPrimary, #1e2134);
  background-color: var(--fillBgInputDefault, #fbfcfe);
  box-sizing: border-box;
  width: 100%;
  min-height: 144px;
  ${(props) =>
    props.$minHeight &&
    css`
      min-height: ${props.$minHeight}px;
    `};
  ${(props) =>
    props.$height &&
    css`
      height: ${props.$height}px;
    `};
  ${(props) =>
    props.$hide &&
    css`
      display: none;
    `};
  max-height: 672px;
  resize: vertical;
  outline: none;
  font-size: 14px;
  line-height: 24px;
  padding: 10px 16px;
  font-family: Inter, sans-serif;
  border: none;
  border-bottom: 1px solid var(--strokeActionDefault, #e2e8f0);
  ${(props) => props.$theme?.textarea};

  :hover,
  :focus {
    border-color: #b7c0cc;
  }
`;
