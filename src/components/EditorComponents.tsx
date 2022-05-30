import styled, { css } from "styled-components";
import * as React from "react";

export const EditorWrapper = styled.div`
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 12px;
`;

export const ToolBar = styled.div`
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
`;

interface TabProps {
  active: boolean;
}

export const Tab = styled.button<TabProps>`
  all: unset;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  border-bottom: 3px solid #ffffff;
  ${(props) =>
          props.active &&
          css`
            border-bottom: 3px solid #04d2c5;
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

interface HideProps {
  hide: boolean;
}

export const ToolbarItemsWrapper = styled.div<HideProps>`
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
`

export const Textarea = styled.textarea<HideProps>`
  width: 100%;
  min-height: 144px;
  border: none;
  outline: none;
  font-size: 14px;
  line-height: 24px;
  padding: 12px;
  background: #fbfcfe;
  ${(props) =>
          props.hide &&
          css`
            display: none;
          `};
`
