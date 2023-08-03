import styled, { css } from "styled-components";
import { ThemeCss } from "../types";

interface Props {
  minHeight?: number;
  $theme?: ThemeCss;
}

const no_scroll_bar = css`
  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const MarkdownPreviewWrapper = styled.div<Props>`
  box-sizing: border-box;
  flex-basis: 100%;
  min-height: 144px;
  background-color: #fbfcfe;
  ${(props) => props.$theme && props.$theme.preview};
  padding: 12px;

  .markdown-body {
    background-color: inherit !important;
  }

  ${(props) =>
    props.minHeight &&
    css`
      min-height: ${props.minHeight}px;
    `};
`;

export const MarkdownBody = styled.div`
  font-size: 14px;
  line-height: 24px;
  font-weight: normal;
  color: var(--textPrimary, #1e2134);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: transparent;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 500;

    :not(:first-child) {
      margin-top: 0.25em;
    }

    :not(:last-child) {
      margin-bottom: 0.25em;
    }

    :last-child {
      margin-bottom: 0;
    }
  }

  h1 {
    line-height: 2em;
    font-size: 1.25em;
  }

  h2 {
    line-height: 1.875em;
    font-size: 1.1875em;
  }

  h3 {
    line-height: 1.75em;
    font-size: 1.125em;
  }

  h4 {
    line-height: 1.625em;
    font-size: 1em;
  }

  h5 {
    line-height: 1.5em;
    font-size: 0.9375em;
  }

  h6 {
    line-height: 1.375em;
    font-size: 0.875em;
  }

  p {
    max-width: 48.5em;
    word-break: break-word;
    line-height: 24px !important;
  }

  ol,
  ul {
    padding-left: 1.25em;
  }

  ul {
    list-style-type: disc;
  }

  blockquote {
    margin: 0;
    padding-left: 0.75em;
    border-left: 4px solid #eee;
  }

  pre {
    ${no_scroll_bar};

    * {
      font-family: i-monospace, SFMono-Regular, SF Mono, Menlo, Consolas,
        Liberation Mono, monospace !important;
    }

    margin: 8px 0;
    padding: 0 1em;
    background: #f5f8fa !important;
    border-radius: 0.25em;
    white-space: pre-wrap !important;
    overflow-x: scroll;

    > code {
      padding: 0 !important;
      background: transparent !important;
      white-space: pre-wrap !important;

      span.identifier {
        white-space: nowrap !important;
      }
    }
  }

  code {
    font-family: i-monospace, SFMono-Regular, SF Mono, Menlo, Consolas,
      Liberation Mono, monospace !important;
    ${no_scroll_bar};
    max-width: 100%;
    padding: 0 0.25rem;
    background: #f5f8fa !important;
    border-radius: 0.25rem;
    white-space: nowrap !important;
    word-break: keep-all;
    overflow-x: scroll;
    display: inline-flex;
  }

  a {
    color: #0974cd;
    cursor: pointer;
  }

  img {
    max-width: 100%;
  }

  p a::selection {
    background-color: transparent !important;
    color: inherit;
  }

  th,
  td {
    border: 1px solid #e0e4eb;
  }

  table {
    margin: 8px 0;
    border-collapse: collapse;
    max-width: 100%;
    overflow: auto;
    display: block;
  }

  th {
    padding: 10px 16px;
    background: #f6f7fa;
    font-weight: bold;
    color: var(--textPrimary, #1e2134);
    min-width: 100px;
  }

  td {
    padding: 10px 16px;
    color: var(--textPrimary, #1e2134);
  }
`;
