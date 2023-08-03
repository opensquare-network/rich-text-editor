import { css } from "styled-components";

const no_scroll_bar = css`
  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export default css`
  position: relative;
  border-radius: 4px;

  .ql-editor > p,
  .osn-previewer > div > p {
    margin-top: 8px;
    margin-bottom: 8px;
  }

  .ql-editor > p,
  .osn-previewer > div > p:first-child,
  .ql-editor > ol,
  .osn-previewer > div > ol:first-child {
    margin-top: 0;
  }

  ul.ql-mention-list {
    margin-top: 0;
    margin-left: 0;
    padding: 0;
    padding-top: 8px;
    padding-bottom: 8px;
    border-radius: 4px;
    overflow: hidden;
  }

  .ql-mention-list-container {
    margin-left: 20px;
    width: auto;
    min-width: 180px;
    background-color: white;
    cursor: pointer;
    box-shadow: 0px 4px 31px rgb(26 33 44 / 6%),
      0px 0.751293px 8px rgb(26 33 44 / 4%);

    .ql-mention-list-item.selected {
      background-color: #f6f7fa;
      color: #34373c;
    }

    .ql-mention-list-item {
      all: unset;
      display: block;
      padding: 12px 10px;
      min-width: 180px;
      font-size: 14px;
      line-height: 20px;
      font-style: normal;
      font-weight: 500;
      color: #506176;
    }
  }

  .ql-formats {
    ${(props) =>
      props.isPreview &&
      css`
        display: none !important;
      `};
  }

  div.ql-editor {
    min-height: 100px;
    height: ${(props) => props.height}px;
    max-height: 300px;
  }

  .ql-toolbar {
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    padding-left: 210px;
    @media screen and (max-width: 769px) {
      flex: 1;
      overflow-x: scroll;
      border-top: 1px solid #e0e4eb;
      justify-content: flex-start !important;
      ::-webkit-scrollbar {
        display: none;
      }

      ${(props) =>
        props.isPreview &&
        css`
          display: none !important;
        `};
    }
  }

  /*!
   * Quill Editor v1.3.7
   * https://quilljs.com/
   * Copyright (c) 2014, Jason Chen
   * Copyright (c) 2013, salesforce.com
   */

  .ql-container {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    font-size: 14px;
    margin: 0;
  }

  span.mention {
    color: #1f70c7;
  }

  .ql-container.ql-disabled .ql-tooltip {
    visibility: hidden;
  }

  .ql-container.ql-disabled .ql-editor ul[data-checked] > li::before {
    pointer-events: none;
  }

  .ql-clipboard {
    left: -100000px;
    height: 1px;
    overflow-y: hidden;
    position: absolute;
    top: 50%;
  }

  .ql-clipboard p {
    margin: 0;
    padding: 0;
  }

  .ql-editor {
    box-sizing: border-box;
    line-height: 1.42;
    height: 100%;
    outline: none;
    overflow-y: auto;
    padding: 10px 16px;
    tab-size: 4;
    -moz-tab-size: 4;
    text-align: left;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .ql-editor > * {
    cursor: text;
  }

  .ql-editor ol,
  .ql-editor ul,
  .ql-editor pre,
  .ql-editor blockquote,
  .ql-editor h1,
  .ql-editor h2,
  .ql-editor h3,
  .ql-editor h4,
  .ql-editor h5,
  .ql-editor h6 {
    margin: 0;
    padding: 0;
    counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8
      list-9;
  }

  .ql-editor ol,
  .ql-editor ul {
    padding-left: 1.5em;
  }

  .ql-editor ol > li,
  .ql-editor ul > li {
    list-style-type: none;
  }

  .ql-editor ol > li[data-list="bullet"] {
    display: list-item;

    ::before {
      content: "•";
    }
  }

  .ql-editor ul > li::before {
    content: "\\2022";
  }

  .ql-editor ul[data-checked="true"],
  .ql-editor ul[data-checked="false"] {
    pointer-events: none;
  }

  .ql-editor ul[data-checked="true"] > li *,
  .ql-editor ul[data-checked="false"] > li * {
    pointer-events: all;
  }

  .ql-editor ul[data-checked="true"] > li::before,
  .ql-editor ul[data-checked="false"] > li::before {
    color: #777;
    cursor: pointer;
    pointer-events: all;
  }

  .ql-editor ul[data-checked="true"] > li::before {
    content: "\\2611";
  }

  .ql-editor ul[data-checked="false"] > li::before {
    content: "\\2610";
  }

  .ql-editor li::before {
    display: inline-block;
    white-space: nowrap;
    width: 1.2em;
  }

  .ql-editor li:not(.ql-direction-rtl)::before {
    margin-left: -1.5em;
    margin-right: 0.3em;
    text-align: right;
  }

  .ql-editor li.ql-direction-rtl::before {
    margin-left: 0.3em;
    margin-right: -1.5em;
  }

  .ql-editor ol li:not(.ql-direction-rtl),
  .ql-editor ul li:not(.ql-direction-rtl) {
    padding-left: 1.5em;
  }

  .ql-editor ol li.ql-direction-rtl,
  .ql-editor ul li.ql-direction-rtl {
    padding-right: 1.5em;
  }

  .ql-editor ol li {
    counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8
      list-9;
    counter-increment: list-0;
  }

  .ql-editor ol li:before {
    content: counter(list-0, decimal) ". ";
  }

  .ql-editor ol li.ql-indent-1 {
    counter-increment: list-1;
  }

  .ql-editor ol li.ql-indent-1:before {
    content: counter(list-1, lower-alpha) ". ";
  }

  .ql-editor ol li.ql-indent-1 {
    counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
  }

  .ql-editor ol li.ql-indent-2 {
    counter-increment: list-2;
  }

  .ql-editor ol li.ql-indent-2:before {
    content: counter(list-2, lower-roman) ". ";
  }

  .ql-editor ol li.ql-indent-2 {
    counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;
  }

  .ql-editor ol li.ql-indent-3 {
    counter-increment: list-3;
  }

  .ql-editor ol li.ql-indent-3:before {
    content: counter(list-3, decimal) ". ";
  }

  .ql-editor ol li.ql-indent-3 {
    counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;
  }

  .ql-editor ol li.ql-indent-4 {
    counter-increment: list-4;
  }

  .ql-editor ol li.ql-indent-4:before {
    content: counter(list-4, lower-alpha) ". ";
  }

  .ql-editor ol li.ql-indent-4 {
    counter-reset: list-5 list-6 list-7 list-8 list-9;
  }

  .ql-editor ol li.ql-indent-5 {
    counter-increment: list-5;
  }

  .ql-editor ol li.ql-indent-5:before {
    content: counter(list-5, lower-roman) ". ";
  }

  .ql-editor ol li.ql-indent-5 {
    counter-reset: list-6 list-7 list-8 list-9;
  }

  .ql-editor ol li.ql-indent-6 {
    counter-increment: list-6;
  }

  .ql-editor ol li.ql-indent-6:before {
    content: counter(list-6, decimal) ". ";
  }

  .ql-editor ol li.ql-indent-6 {
    counter-reset: list-7 list-8 list-9;
  }

  .ql-editor ol li.ql-indent-7 {
    counter-increment: list-7;
  }

  .ql-editor ol li.ql-indent-7:before {
    content: counter(list-7, lower-alpha) ". ";
  }

  .ql-editor ol li.ql-indent-7 {
    counter-reset: list-8 list-9;
  }

  .ql-editor ol li.ql-indent-8 {
    counter-increment: list-8;
  }

  .ql-editor ol li.ql-indent-8:before {
    content: counter(list-8, lower-roman) ". ";
  }

  .ql-editor ol li.ql-indent-8 {
    counter-reset: list-9;
  }

  .ql-editor ol li.ql-indent-9 {
    counter-increment: list-9;
  }

  .ql-editor ol li.ql-indent-9:before {
    content: counter(list-9, decimal) ". ";
  }

  .ql-editor .ql-indent-1:not(.ql-direction-rtl) {
    padding-left: 3em;
  }

  .ql-editor li.ql-indent-1:not(.ql-direction-rtl) {
    padding-left: 4.5em;
  }

  .ql-editor .ql-indent-1.ql-direction-rtl.ql-align-right {
    padding-right: 3em;
  }

  .ql-editor li.ql-indent-1.ql-direction-rtl.ql-align-right {
    padding-right: 4.5em;
  }

  .ql-editor .ql-indent-2:not(.ql-direction-rtl) {
    padding-left: 6em;
  }

  .ql-editor li.ql-indent-2:not(.ql-direction-rtl) {
    padding-left: 7.5em;
  }

  .ql-editor .ql-indent-2.ql-direction-rtl.ql-align-right {
    padding-right: 6em;
  }

  .ql-editor li.ql-indent-2.ql-direction-rtl.ql-align-right {
    padding-right: 7.5em;
  }

  .ql-editor .ql-indent-3:not(.ql-direction-rtl) {
    padding-left: 9em;
  }

  .ql-editor li.ql-indent-3:not(.ql-direction-rtl) {
    padding-left: 10.5em;
  }

  .ql-editor .ql-indent-3.ql-direction-rtl.ql-align-right {
    padding-right: 9em;
  }

  .ql-editor li.ql-indent-3.ql-direction-rtl.ql-align-right {
    padding-right: 10.5em;
  }

  .ql-editor .ql-indent-4:not(.ql-direction-rtl) {
    padding-left: 12em;
  }

  .ql-editor li.ql-indent-4:not(.ql-direction-rtl) {
    padding-left: 13.5em;
  }

  .ql-editor .ql-indent-4.ql-direction-rtl.ql-align-right {
    padding-right: 12em;
  }

  .ql-editor li.ql-indent-4.ql-direction-rtl.ql-align-right {
    padding-right: 13.5em;
  }

  .ql-editor .ql-indent-5:not(.ql-direction-rtl) {
    padding-left: 15em;
  }

  .ql-editor li.ql-indent-5:not(.ql-direction-rtl) {
    padding-left: 16.5em;
  }

  .ql-editor .ql-indent-5.ql-direction-rtl.ql-align-right {
    padding-right: 15em;
  }

  .ql-editor li.ql-indent-5.ql-direction-rtl.ql-align-right {
    padding-right: 16.5em;
  }

  .ql-editor .ql-indent-6:not(.ql-direction-rtl) {
    padding-left: 18em;
  }

  .ql-editor li.ql-indent-6:not(.ql-direction-rtl) {
    padding-left: 19.5em;
  }

  .ql-editor .ql-indent-6.ql-direction-rtl.ql-align-right {
    padding-right: 18em;
  }

  .ql-editor li.ql-indent-6.ql-direction-rtl.ql-align-right {
    padding-right: 19.5em;
  }

  .ql-editor .ql-indent-7:not(.ql-direction-rtl) {
    padding-left: 21em;
  }

  .ql-editor li.ql-indent-7:not(.ql-direction-rtl) {
    padding-left: 22.5em;
  }

  .ql-editor .ql-indent-7.ql-direction-rtl.ql-align-right {
    padding-right: 21em;
  }

  .ql-editor li.ql-indent-7.ql-direction-rtl.ql-align-right {
    padding-right: 22.5em;
  }

  .ql-editor .ql-indent-8:not(.ql-direction-rtl) {
    padding-left: 24em;
  }

  .ql-editor li.ql-indent-8:not(.ql-direction-rtl) {
    padding-left: 25.5em;
  }

  .ql-editor .ql-indent-8.ql-direction-rtl.ql-align-right {
    padding-right: 24em;
  }

  .ql-editor li.ql-indent-8.ql-direction-rtl.ql-align-right {
    padding-right: 25.5em;
  }

  .ql-editor .ql-indent-9:not(.ql-direction-rtl) {
    padding-left: 27em;
  }

  .ql-editor li.ql-indent-9:not(.ql-direction-rtl) {
    padding-left: 28.5em;
  }

  .ql-editor .ql-indent-9.ql-direction-rtl.ql-align-right {
    padding-right: 27em;
  }

  .ql-editor li.ql-indent-9.ql-direction-rtl.ql-align-right {
    padding-right: 28.5em;
  }

  .ql-editor .ql-bg-black {
    background-color: #000;
  }

  .ql-editor .ql-bg-red {
    background-color: #e60000;
  }

  .ql-editor .ql-bg-orange {
    background-color: #f90;
  }

  .ql-editor .ql-bg-yellow {
    background-color: #ff0;
  }

  .ql-editor .ql-bg-green {
    background-color: #008a00;
  }

  .ql-editor .ql-bg-blue {
    background-color: #06c;
  }

  .ql-editor .ql-bg-purple {
    background-color: #93f;
  }

  .ql-editor .ql-color-white {
    color: #fff;
  }

  .ql-editor .ql-color-red {
    color: #e60000;
  }

  .ql-editor .ql-color-orange {
    color: #f90;
  }

  .ql-editor .ql-color-yellow {
    color: #ff0;
  }

  .ql-editor .ql-color-green {
    color: #008a00;
  }

  .ql-editor .ql-color-blue {
    color: #06c;
  }

  .ql-editor .ql-color-purple {
    color: #93f;
  }

  .ql-editor .ql-font-serif {
    font-family: Georgia, Times New Roman, serif;
  }

  .ql-editor .ql-font-monospace {
    font-family: Monaco, Courier New, monospace;
  }

  .ql-editor .ql-size-small {
    font-size: 0.75em;
  }

  .ql-editor .ql-size-large {
    font-size: 1.5em;
  }

  .ql-editor .ql-size-huge {
    font-size: 2.5em;
  }

  .ql-editor .ql-direction-rtl {
    direction: rtl;
    text-align: inherit;
  }

  .ql-editor .ql-align-center {
    text-align: center;
  }

  .ql-editor .ql-align-justify {
    text-align: justify;
  }

  .ql-editor .ql-align-right {
    text-align: right;
  }

  .ql-editor.ql-blank::before {
    color: rgba(0, 0, 0, 0.6);
    content: attr(data-placeholder);
    font-style: italic;
    left: 15px;
    pointer-events: none;
    position: absolute;
    right: 15px;
  }

  .ql-snow.ql-toolbar:after,
  .ql-toolbar:after {
    clear: both;
    content: "";
    display: table;
  }

  .ql-snow.ql-toolbar button,
  .ql-toolbar button {
    background: none;
    border: none;
    cursor: pointer;
    display: inline-block;
    float: left;
    height: 24px;
    padding: 3px 5px;
    width: 28px;
  }

  .ql-snow.ql-toolbar button svg,
  .ql-toolbar button svg {
    float: left;
    height: 100%;
  }

  .ql-snow.ql-toolbar button:active:hover,
  .ql-toolbar button:active:hover {
    outline: none;
  }

  .ql-snow.ql-toolbar input.ql-image[type="file"],
  .ql-toolbar input.ql-image[type="file"] {
    display: none;
  }

  .ql-snow.ql-toolbar button:hover,
  .ql-toolbar button:hover,
  .ql-snow.ql-toolbar button:focus,
  .ql-toolbar button:focus,
  .ql-snow.ql-toolbar button.ql-active,
  .ql-toolbar button.ql-active,
  .ql-snow.ql-toolbar .ql-picker-label:hover,
  .ql-toolbar .ql-picker-label:hover,
  .ql-snow.ql-toolbar .ql-picker-label.ql-active,
  .ql-toolbar .ql-picker-label.ql-active,
  .ql-snow.ql-toolbar .ql-picker-item:hover,
  .ql-toolbar .ql-picker-item:hover,
  .ql-snow.ql-toolbar .ql-picker-item.ql-selected,
  .ql-toolbar .ql-picker-item.ql-selected {
    color: var(--textPrimary, #1e2134);
  }

  .ql-snow.ql-toolbar button:hover .ql-fill,
  .ql-toolbar button:hover .ql-fill,
  .ql-snow.ql-toolbar button:focus .ql-fill,
  .ql-toolbar button:focus .ql-fill,
  .ql-snow.ql-toolbar button.ql-active .ql-fill,
  .ql-toolbar button.ql-active .ql-fill,
  .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,
  .ql-toolbar .ql-picker-label:hover .ql-fill,
  .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,
  .ql-toolbar .ql-picker-label.ql-active .ql-fill,
  .ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill,
  .ql-toolbar .ql-picker-item:hover .ql-fill,
  .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill,
  .ql-toolbar .ql-picker-item.ql-selected .ql-fill,
  .ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill,
  .ql-toolbar button:hover .ql-stroke.ql-fill,
  .ql-snow.ql-toolbar button:focus .ql-stroke.ql-fill,
  .ql-toolbar button:focus .ql-stroke.ql-fill,
  .ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill,
  .ql-toolbar button.ql-active .ql-stroke.ql-fill,
  .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
  .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
  .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
  .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
  .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
  .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
  .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill,
  .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {
    fill: var(--textPrimary, #1e2134);
  }

  .ql-snow.ql-toolbar button:hover .ql-stroke,
  .ql-toolbar button:hover .ql-stroke,
  .ql-snow.ql-toolbar button:focus .ql-stroke,
  .ql-toolbar button:focus .ql-stroke,
  .ql-snow.ql-toolbar button.ql-active .ql-stroke,
  .ql-toolbar button.ql-active .ql-stroke,
  .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
  .ql-toolbar .ql-picker-label:hover .ql-stroke,
  .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
  .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
  .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke,
  .ql-toolbar .ql-picker-item:hover .ql-stroke,
  .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
  .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
  .ql-snow.ql-toolbar button:hover .ql-stroke-miter,
  .ql-toolbar button:hover .ql-stroke-miter,
  .ql-snow.ql-toolbar button:focus .ql-stroke-miter,
  .ql-toolbar button:focus .ql-stroke-miter,
  .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter,
  .ql-toolbar button.ql-active .ql-stroke-miter,
  .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
  .ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
  .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
  .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
  .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
  .ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
  .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,
  .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
    stroke: var(--textPrimary, #1e2134);
  }

  @media (pointer: coarse) {
    .ql-snow.ql-toolbar button:hover:not(.ql-active),
    .ql-toolbar button:hover:not(.ql-active) {
      color: #506176;
    }

    .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-fill,
    .ql-toolbar button:hover:not(.ql-active) .ql-fill,
    .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill,
    .ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill {
      fill: #506176;
    }

    .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke,
    .ql-toolbar button:hover:not(.ql-active) .ql-stroke,
    .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter,
    .ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter {
      stroke: #506176;
    }
  }
   {
    box-sizing: border-box;
  }

  * {
    box-sizing: border-box;
  }

  .ql-hidden {
    display: none;
  }

  .ql-out-bottom,
  .ql-out-top {
    visibility: hidden;
  }

  .ql-tooltip {
    position: absolute;
    transform: translateY(10px);
  }

  .ql-tooltip a {
    cursor: pointer;
    text-decoration: none;
  }

  .ql-tooltip.ql-flip {
    transform: translateY(-10px);
  }

  .ql-formats {
    display: inline-block;
    vertical-align: middle;
  }

  .ql-formats:after {
    clear: both;
    content: "";
    display: table;
  }

  .ql-stroke {
    fill: none;
    stroke: #506176;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
  }

  .ql-stroke-miter {
    fill: none;
    stroke: #506176;
    stroke-miterlimit: 10;
    stroke-width: 2;
  }

  .ql-fill,
  .ql-stroke.ql-fill {
    fill: #506176;
  }

  .ql-empty {
    fill: none;
  }

  .ql-even {
    fill-rule: evenodd;
  }

  .ql-thin,
  .ql-stroke.ql-thin {
    stroke-width: 1;
  }

  .ql-transparent {
    opacity: 0.4;
  }

  .ql-direction svg:last-child {
    display: none;
  }

  .ql-direction.ql-active svg:last-child {
    display: inline;
  }

  .ql-direction.ql-active svg:first-child {
    display: none;
  }

  .ql-editor a {
    text-decoration: none;
  }

  .ql-editor blockquote {
    border-left: 4px solid #ccc;
    margin-bottom: 5px;
    margin-top: 5px;
    padding-left: 16px;
  }

  .ql-editor code,
  .ql-editor pre {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    border-radius: 3px;
    background-color: #f0f3f8 !important;
  }

  .ql-editor pre {
    white-space: pre-wrap;
    margin-bottom: 5px;
    margin-top: 5px;
    padding: 5px 10px;
  }

  .ql-editor code {
    font-size: 85%;
    padding: 2px 4px;
  }

  .ql-editor pre.ql-syntax {
    background-color: #23241f;
    color: #f8f8f2;
    overflow: visible;
  }

  .ql-editor img {
    max-width: 100%;
  }

  .ql-picker {
    color: #506176;
    display: inline-block;
    float: left;
    font-size: 14px;
    font-weight: 500;
    height: 24px;
    position: relative;
    vertical-align: middle;
  }

  .ql-picker-label {
    cursor: pointer;
    display: inline-block;
    height: 100%;
    padding-left: 8px;
    padding-right: 22px;
    position: relative;
    width: 100%;
  }

  .ql-picker-label::before {
    display: inline-block;
    line-height: 24px;
  }

  .ql-picker-options {
    background-color: #fff;
    display: none;
    min-width: 100%;
    padding: 4px 8px;
    position: absolute;
    white-space: nowrap;
  }

  .ql-picker-options .ql-picker-item {
    cursor: pointer;
    display: block;
    padding-bottom: 5px;
    padding-top: 5px;
  }

  .ql-picker.ql-expanded .ql-picker-label {
    color: #ccc;
    z-index: 2;
  }

  .ql-picker.ql-expanded .ql-picker-label .ql-fill {
    fill: #ccc;
  }

  .ql-picker.ql-expanded .ql-picker-label .ql-stroke {
    stroke: #ccc;
  }

  .ql-picker.ql-expanded .ql-picker-options {
    display: block;
    margin-top: -1px;
    top: 100%;
    z-index: 1;
  }

  .ql-color-picker,
  .ql-icon-picker {
    width: 28px;
  }

  .ql-color-picker .ql-picker-label,
  .ql-icon-picker .ql-picker-label {
    padding: 2px 4px;
  }

  .ql-color-picker .ql-picker-label svg,
  .ql-icon-picker .ql-picker-label svg {
    right: 4px;
  }

  .ql-icon-picker .ql-picker-options {
    padding: 4px 0px;
  }

  .ql-icon-picker .ql-picker-item {
    height: 24px;
    width: 24px;
    padding: 2px 4px;
  }

  .ql-color-picker .ql-picker-options {
    padding: 3px 5px;
    width: 152px;
  }

  .ql-color-picker .ql-picker-item {
    border: 1px solid transparent;
    float: left;
    height: 16px;
    margin: 2px;
    padding: 0px;
    width: 16px;
  }

  .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg {
    position: absolute;
    margin-top: -9px;
    right: 0;
    top: 50%;
    width: 18px;

    polygon {
      stroke: #506176;

      :hover {
        stroke: var(--textPrimary, #1e2134);
        color: var(--textPrimary, #1e2134);
      }
    }
  }

  .ql-picker.ql-header
    .ql-picker-label[data-label]:not([data-label=""])::before,
  .ql-picker.ql-font .ql-picker-label[data-label]:not([data-label=""])::before,
  .ql-picker.ql-size .ql-picker-label[data-label]:not([data-label=""])::before,
  .ql-picker.ql-header .ql-picker-item[data-label]:not([data-label=""])::before,
  .ql-picker.ql-font .ql-picker-item[data-label]:not([data-label=""])::before,
  .ql-picker.ql-size .ql-picker-item[data-label]:not([data-label=""])::before {
    content: attr(data-label);
  }

  .ql-formats {
    button {
      svg {
        :hover {
          path {
            fill: var(--textPrimary, #1e2134);
          }
        }
      }
    }
  }

  select.ql-header {
    width: 98px;
    color: #506176;
    display: inline-block;
    float: left;
    font-size: 14px;
    font-weight: 500;
    height: 24px;
    position: relative;
    vertical-align: middle;
    background: #f6f7fa;
  }

  option {
    display: block;
  }

  .ql-toolbar,
  .ql-formats {
    display: flex;
    flex-wrap: nowrap;
    background: #f6f7fa;
  }

  .ql-toolbar {
    align-items: center;
    height: 40px;
  }

  .ql-formats button {
    padding: 0;
  }

  .ql-picker.ql-header .ql-picker-label::before,
  .ql-header .ql-picker-item::before {
    display: block;
    content: "Normal";
  }

  .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
  .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: "Heading 1";
  }

  .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
  .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: "Heading 2";
  }

  .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
  .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: "Heading 3";
  }

  .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
  .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: "Heading 4";
  }

  .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
  .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: "Heading 5";
  }

  .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
  .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: "Heading 6";
  }

  .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    font-size: 2em;
  }

  .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    font-size: 1.5em;
  }

  .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    font-size: 1.17em;
  }

  .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    font-size: 1em;
  }

  .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    font-size: 0.83em;
  }

  .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    font-size: 0.67em;
  }

  .ql-picker.ql-font {
    width: 108px;
  }

  .ql-picker.ql-font .ql-picker-label::before,
  .ql-picker.ql-font .ql-picker-item::before {
    content: "Sans Serif";
  }

  .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
  .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
    content: "Serif";
  }

  .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
  .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
    content: "Monospace";
  }

  .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
    font-family: Georgia, Times New Roman, serif;
  }

  .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
    font-family: Monaco, Courier New, monospace;
  }

  .ql-picker.ql-size {
    width: 98px;
  }

  .ql-picker.ql-size .ql-picker-label::before,
  .ql-picker.ql-size .ql-picker-item::before {
    content: "Normal";
  }

  .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
  .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
    content: "Small";
  }

  .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
  .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
    content: "Large";
  }

  .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
  .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
    content: "Huge";
  }

  .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
    font-size: 10px;
  }

  .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
    font-size: 18px;
  }

  .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
    font-size: 32px;
  }

  .ql-color-picker.ql-background .ql-picker-item {
    background-color: #fff;
  }

  .ql-color-picker.ql-color .ql-picker-item {
    background-color: #000;
  }

  .ql-toolbar {
    box-sizing: border-box;
    font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
    padding: 8px;
    justify-content: end;
    height: 41px;
    border-bottom: 1px solid #e0e4eb !important;
  }

  .ql-toolbar.ql-formats {
    margin-right: 15px;
  }

  .ql-toolbar.ql-picker-label {
    border: 1px solid transparent;
  }

  .ql-toolbar.ql-picker-options {
    border: 1px solid transparent;
    box-shadow: rgba(0, 0, 0, 0.2) 0 2px 8px;
  }

  .ql-toolbar.ql-picker.ql-expanded .ql-picker-label {
    border-color: #ccc;
  }

  .ql-toolbar.ql-picker.ql-expanded .ql-picker-options {
    border-color: #ccc;
  }

  .ql-toolbar.ql-color-picker .ql-picker-item.ql-selected,
  .ql-toolbar.ql-color-picker .ql-picker-item:hover {
    border-color: #000;
  }

  .ql-toolbar + .ql-container {
    border-top: 0px;
  }

  .ql-tooltip {
    background-color: #fff;
    border: 1px solid #ccc;
    box-shadow: 0px 0px 5px #ddd;
    color: #506176;
    padding: 5px 12px;
    white-space: nowrap;
  }

  .ql-tooltip::before {
    content: "Visit URL:";
    line-height: 26px;
    margin-right: 8px;
  }

  .ql-tooltip input[type="text"] {
    display: none;
    border: 1px solid #ccc;
    font-size: 13px;
    height: 26px;
    margin: 0px;
    padding: 3px 5px;
    width: 170px;
  }

  .ql-tooltip a.ql-preview {
    display: inline-block;
    max-width: 200px;
    overflow-x: hidden;
    text-overflow: ellipsis;
    vertical-align: top;
  }

  .ql-tooltip a.ql-action::after {
    border-right: 1px solid #ccc;
    content: "Edit";
    margin-left: 16px;
    padding-right: 8px;
  }

  .ql-tooltip a.ql-remove::before {
    content: "Remove";
    margin-left: 8px;
  }

  .ql-tooltip a {
    line-height: 26px;
  }

  .ql-tooltip.ql-editing a.ql-preview,
  .ql-tooltip.ql-editing a.ql-remove {
    display: none;
  }

  .ql-tooltip.ql-editing input[type="text"] {
    display: inline-block;
  }

  .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: "Save";
    padding-right: 0px;
  }

  .ql-tooltip[data-mode="link"]::before {
    content: "Enter link:";
  }

  .ql-tooltip[data-mode="formula"]::before {
    content: "Enter formula:";
  }

  .ql-tooltip[data-mode="video"]::before {
    content: "Enter video:";
  }

  a {
    color: #06c;
  }

  word-break: normal;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;

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
    line-height: 28px;
    font-size: 20px;
  }

  h2 {
    line-height: 24px;
    font-size: 18px;
  }

  h3 {
    line-height: 24px;
    font-size: 16px;
  }

  h4 {
    line-height: 24px;
    font-size: 14px;
  }

  p {
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
    padding: 0 8px;
    background-color: #f0f3f8 !important;
    border-radius: 4px;
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
    padding: 0 8px;
    background-color: #f0f3f8 !important;
    border-radius: 4px;
    white-space: nowrap !important;
    word-break: keep-all;
    overflow-x: scroll;
    display: inline-flex;
  }

  a {
    color: #1f70c7;
    cursor: pointer;
    text-decoration: none;
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
    border: 1px solid #e2e8f0;
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
    background-color: #f0f3f8;
    font-weight: bold;
    color: var(--textPrimary, #1e2134);
    min-width: 100px;
  }

  td {
    padding: 10px 16px;
    color: var(--textPrimary, #1e2134);
  }

  hr {
    background-color: #e2e8f0;
    height: 1px;
    border: none;
  }
`;
