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
  border-top: 1px solid #e2e8f0;
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
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
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

type TabsWrapperProps = {
  $theme: ThemeCss;
};
export const TabsWrapper = styled.div<TabsWrapperProps>`
  display: flex;
  gap: 24px;
  height: 48px;
  /* mobile */
  @media screen and (max-width: 769px) {
    border-bottom: 1px solid #e2e8f0;
    width: 100%;
  }
  ${(props) => props.$theme.tabs};
`;

interface TabProps {
  $active: boolean;
  $theme: ThemeCss;
}

export const Tab = styled.button<TabProps>`
  all: unset;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  border-bottom: 3px solid #ffffff;
  ${(props) => props.$theme.tab};
  ${(props) =>
    props.$active &&
    css`
      border-bottom: 3px solid #04d2c5;
    `};
  ${(props) =>
    props.$active &&
    css`
      border-bottom: 3px solid #04d2c5;
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
    height: 48px;
  }
`;

export const ToolbarButton = styled.button`
  all: unset;
  cursor: pointer;
  width: 24px;
  height: 24px;

  &:hover svg path {
    fill: var(--textPrimary, #1e2134);
  }
`;

export const Textarea = styled.textarea<Props>`
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
  padding: 12px;
  background: #fbfcfe;
  font-family: Inter, sans-serif;
  border: none;
  border-bottom: 1px solid #e2e8f0;
  ${(props) => props.$theme?.textarea};

  :hover,
  :focus {
    border-color: #b7c0cc;
  }

  ::selection {
    background-color: #e2e8f0;
  }
`;
