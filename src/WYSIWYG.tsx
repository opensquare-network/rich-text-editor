import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";

import Quill, {
  QuillOptionsStatic,
  RangeStatic,
  BoundsStatic,
  StringMap,
  Sources
} from "quill";
import styled, { css } from "styled-components";

export interface OptionalAttributes {
  attributes?: StringMap;
}

type DeltaOperation = { insert?: any, delete?: number, retain?: number } & OptionalAttributes;

interface DeltaStatic {
  ops?: DeltaOperation[];

  retain(length: number, attributes?: StringMap): DeltaStatic;

  delete(length: number): DeltaStatic;

  filter(predicate: (op: DeltaOperation) => boolean): DeltaOperation[];

  forEach(predicate: (op: DeltaOperation) => void): void;

  insert(text: any, attributes?: StringMap): DeltaStatic;

  map<T>(predicate: (op: DeltaOperation) => T): T[];

  partition(predicate: (op: DeltaOperation) => boolean): [DeltaOperation[], DeltaOperation[]];

  reduce<T>(predicate: (acc: T, curr: DeltaOperation, idx: number, arr: DeltaOperation[]) => T, initial: T): T;

  chop(): DeltaStatic;

  length(): number;

  slice(start?: number, end?: number): DeltaStatic;

  compose(other: DeltaStatic): DeltaStatic;

  concat(other: DeltaStatic): DeltaStatic;

  diff(other: DeltaStatic, index?: number): DeltaStatic;

  eachLine(predicate: (line: DeltaStatic, attributes: StringMap, idx: number) => any, newline?: string): DeltaStatic;

  transform(index: number, priority?: boolean): number;

  transform(other: DeltaStatic, priority: boolean): DeltaStatic;

  transformPosition(index: number, priority?: boolean): number;
}


export interface QuillOptions extends QuillOptionsStatic {
  tabIndex?: number,
}

const StateToggle = styled.div`
  position: absolute;
  display: flex;

  button {
    all: unset;
    padding: 12px;
    font-size: 14px;
    line-height: 14px;
    font-weight: 500;
    cursor: pointer;
    //border-radius: 4px;
    color: #9DA9BB;
    //border: 1px solid #E0E4EB;
    border-top: none;
  }

  button.active {
    background-color: #ffffff;
    //border: 1px solid #ffffff;
    color: #1E2134;
  }

  button:hover {
    color: #506176;
  }
`;

const VerticalDivider = styled.div`
  width: 1px;
  height: 40px;
  background-color: #E0E4EB;
`;

interface Props {
  isPreview: boolean;
}

const Wrapper = styled.div<Props>`
  position: relative;
  border: 1px solid #E0E4EB;
  border-radius: 4px;
  .ql-formats {
    ${(props) =>
            props.isPreview &&
            css`
            display: none !important;
          `};
  }
  
  .ql-editor {
    min-height: 200px;
  }
  
  .ql-toolbar {
    padding-left: 210px;
  }

  /*!
   * Quill Editor v1.3.7
   * https://quilljs.com/
   * Copyright (c) 2014, Jason Chen
   * Copyright (c) 2013, salesforce.com
   */

  .ql-container {
    box-sizing: border-box;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 13px;
    height: 100%;
    margin: 0px;
    position: relative;
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
    padding: 12px 16px;
    tab-size: 4;
    -moz-tab-size: 4;
    text-align: left;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .ql-editor > * {
    cursor: text;
  }

  .ql-editor p,
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
    counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
  }

  .ql-editor ol,
  .ql-editor ul {
    padding-left: 1.5em;
  }

  .ql-editor ol > li,
  .ql-editor ul > li {
    list-style-type: none;
  }

  .ql-editor ul > li::before {
    content: '\\2022';
  }

  .ql-editor ul[data-checked=true],
  .ql-editor ul[data-checked=false] {
    pointer-events: none;
  }

  .ql-editor ul[data-checked=true] > li *,
  .ql-editor ul[data-checked=false] > li * {
    pointer-events: all;
  }

  .ql-editor ul[data-checked=true] > li::before,
  .ql-editor ul[data-checked=false] > li::before {
    color: #777;
    cursor: pointer;
    pointer-events: all;
  }

  .ql-editor ul[data-checked=true] > li::before {
    content: '\\2611';
  }

  .ql-editor ul[data-checked=false] > li::before {
    content: '\\2610';
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
    counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
    counter-increment: list-0;
  }

  .ql-editor ol li:before {
    content: counter(list-0, decimal) '. ';
  }

  .ql-editor ol li.ql-indent-1 {
    counter-increment: list-1;
  }

  .ql-editor ol li.ql-indent-1:before {
    content: counter(list-1, lower-alpha) '. ';
  }

  .ql-editor ol li.ql-indent-1 {
    counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
  }

  .ql-editor ol li.ql-indent-2 {
    counter-increment: list-2;
  }

  .ql-editor ol li.ql-indent-2:before {
    content: counter(list-2, lower-roman) '. ';
  }

  .ql-editor ol li.ql-indent-2 {
    counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;
  }

  .ql-editor ol li.ql-indent-3 {
    counter-increment: list-3;
  }

  .ql-editor ol li.ql-indent-3:before {
    content: counter(list-3, decimal) '. ';
  }

  .ql-editor ol li.ql-indent-3 {
    counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;
  }

  .ql-editor ol li.ql-indent-4 {
    counter-increment: list-4;
  }

  .ql-editor ol li.ql-indent-4:before {
    content: counter(list-4, lower-alpha) '. ';
  }

  .ql-editor ol li.ql-indent-4 {
    counter-reset: list-5 list-6 list-7 list-8 list-9;
  }

  .ql-editor ol li.ql-indent-5 {
    counter-increment: list-5;
  }

  .ql-editor ol li.ql-indent-5:before {
    content: counter(list-5, lower-roman) '. ';
  }

  .ql-editor ol li.ql-indent-5 {
    counter-reset: list-6 list-7 list-8 list-9;
  }

  .ql-editor ol li.ql-indent-6 {
    counter-increment: list-6;
  }

  .ql-editor ol li.ql-indent-6:before {
    content: counter(list-6, decimal) '. ';
  }

  .ql-editor ol li.ql-indent-6 {
    counter-reset: list-7 list-8 list-9;
  }

  .ql-editor ol li.ql-indent-7 {
    counter-increment: list-7;
  }

  .ql-editor ol li.ql-indent-7:before {
    content: counter(list-7, lower-alpha) '. ';
  }

  .ql-editor ol li.ql-indent-7 {
    counter-reset: list-8 list-9;
  }

  .ql-editor ol li.ql-indent-8 {
    counter-increment: list-8;
  }

  .ql-editor ol li.ql-indent-8:before {
    content: counter(list-8, lower-roman) '. ';
  }

  .ql-editor ol li.ql-indent-8 {
    counter-reset: list-9;
  }

  .ql-editor ol li.ql-indent-9 {
    counter-increment: list-9;
  }

  .ql-editor ol li.ql-indent-9:before {
    content: counter(list-9, decimal) '. ';
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
    content: '';
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

  .ql-snow.ql-toolbar input.ql-image[type=file],
  .ql-toolbar input.ql-image[type=file] {
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
    color: #1E2134;
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
    fill: #1E2134;
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
    stroke: #1E2134;
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
  } {
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
    content: '';
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

  .ql-editor h1 {
    font-size: 2em;
  }

  .ql-editor h2 {
    font-size: 1.5em;
  }

  .ql-editor h3 {
    font-size: 1.17em;
  }

  .ql-editor h4 {
    font-size: 1em;
  }

  .ql-editor h5 {
    font-size: 0.83em;
  }

  .ql-editor h6 {
    font-size: 0.67em;
  }

  .ql-editor a {
    text-decoration: underline;
  }

  .ql-editor blockquote {
    border-left: 4px solid #ccc;
    margin-bottom: 5px;
    margin-top: 5px;
    padding-left: 16px;
  }

  .ql-editor code,
  .ql-editor pre {
    background-color: #f0f0f0;
    border-radius: 3px;
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
        stroke: #1E2134;
        color: #1E2134;
      }
    }
  }

  .ql-picker.ql-header .ql-picker-label[data-label]:not([data-label=''])::before,
  .ql-picker.ql-font .ql-picker-label[data-label]:not([data-label=''])::before,
  .ql-picker.ql-size .ql-picker-label[data-label]:not([data-label=''])::before,
  .ql-picker.ql-header .ql-picker-item[data-label]:not([data-label=''])::before,
  .ql-picker.ql-font .ql-picker-item[data-label]:not([data-label=''])::before,
  .ql-picker.ql-size .ql-picker-item[data-label]:not([data-label=''])::before {
    content: attr(data-label);
  }

  .ql-formats {
    button {
      svg {
        :hover {
          path {
            fill: #1E2134;
          }
        }
      }
    }

    //.ql-bold::before {
    //  display: block;
    //  content: '';
    //  width: 24px;
    //  height: 24px;
    //  background: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 6a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h5.5a3.5 3.5 0 0 0 1.852-6.47A3.5 3.5 0 0 0 12.5 6H8zm4.5 5a1.5 1.5 0 0 0 0-3H9v3h3.5zM9 13v3h4.5a1.5 1.5 0 0 0 0-3H9z' fill='%23506176'/%3E%3C/svg%3E") no-repeat center/100%;
    //}
    //
    //.ql-underline::before {
    //  display: block;
    //  content: '';
    //  width: 24px;
    //  height: 24px;
    //  background: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8.297 5.308a.74.74 0 0 1 .74.74v5.239a2.962 2.962 0 1 0 5.925 0V6.048a.74.74 0 0 1 1.481 0v5.239a4.443 4.443 0 1 1-8.886 0V6.048a.74.74 0 0 1 .74-.74zM6.076 17.952a.74.74 0 0 1 .74-.74h10.367a.74.74 0 1 1 0 1.48H6.816a.74.74 0 0 1-.74-.74z' fill='%23506176'/%3E%3C/svg%3E") no-repeat center/100%;
    //}
    //
    //.ql-strike::before {
    //  display: block;
    //  content: '';
    //  width: 24px;
    //  height: 24px;
    //  background: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16.134 13.604c.185.414.278.875.278 1.38 0 1.077-.42 1.919-1.26 2.525-.842.605-2.003.908-3.484.908-1.166 0-2.32-.24-3.465-.72a.733.733 0 0 1-.442-.681c0-.59.644-.964 1.194-.753a7.052 7.052 0 0 0 2.549.483c2.046 0 3.072-.588 3.08-1.763a1.774 1.774 0 0 0-.13-.696 2.013 2.013 0 0 0-.487-.684H4.78V12h14.44v1.604l-3.086.001zm-3.271-2.406h-4.37a3.27 3.27 0 0 1-.386-.42c-.346-.447-.52-.988-.52-1.625 0-.991.374-1.834 1.121-2.529.749-.695 1.905-1.042 3.47-1.042 1.028 0 2.018.2 2.969.6a.697.697 0 0 1 .418.648c0 .565-.62.928-1.156.753a6.422 6.422 0 0 0-2.01-.312c-1.99 0-2.983.628-2.983 1.882 0 .337.175.631.524.882.35.251.782.45 1.294.602.498.144 1.04.332 1.629.56z' fill='%23506176'/%3E%3C/svg%3E") no-repeat center/100%;
    //}
    //
    //.ql-link::before {
    //  display: block;
    //  content: '';
    //  width: 24px;
    //  height: 24px;
    //  background: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M11.775 7.275a.75.75 0 0 0 1.06 1.06l1.25-1.25a2 2 0 1 1 2.83 2.83l-2.5 2.5a2 2 0 0 1-2.83 0 .75.75 0 0 0-1.06 1.06 3.5 3.5 0 0 0 4.95 0l2.5-2.5a3.5 3.5 0 0 0-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 0 1 0-2.83l2.5-2.5a1.998 1.998 0 0 1 2.83 0 .75.75 0 0 0 1.06-1.06 3.5 3.5 0 0 0-4.95 0l-2.5 2.5a3.5 3.5 0 1 0 4.95 4.95l1.25-1.25a.75.75 0 0 0-1.06-1.06l-1.25 1.25a2 2 0 0 1-2.83 0z' fill='%23506176'/%3E%3C/svg%3E") no-repeat center/100%;
    //}
    //
    //.ql-image::before {
    //  display: block;
    //  content: '';
    //  width: 24px;
    //  height: 24px;
    //  background: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_5445_38250)'%3E%3Cpath d='M18 14v2h2v1.333h-2v2h-1.333v-2h-2V16h2v-2H18zm.006-8c.365 0 .66.297.66.662v6.233a3.991 3.991 0 0 0-1.332-.228V7.333H6.667v9.334l6.195-6.196a.666.666 0 0 1 .88-.056l.062.057 2.364 2.367A4.002 4.002 0 0 0 13.562 18L5.995 18a.662.662 0 0 1-.662-.662V6.662A.667.667 0 0 1 5.995 6h12.01zM9.334 8.667a1.333 1.333 0 1 1 0 2.666 1.333 1.333 0 0 1 0-2.666z' fill='%23506176'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_5445_38250'%3E%3Cpath fill='%23fff' transform='translate(4 4)' d='M0 0h16v16H0z'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E") no-repeat center/100%;
    //}
    //.ql-video::before {
    //  display: block;
    //  content: '';
    //  width: 24px;
    //  height: 24px;
    //  background: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M10.991 5.35h-4.99a.65.65 0 0 0-.65.65v12c0 .359.29.65.65.65h12a.65.65 0 0 0 .65-.65V9 5.999a.65.65 0 0 0-.65-.65h-7.01zm2.795 1.3h-2.438l-1.133 1.7h2.437l1.134-1.7zm1.562 0l-1.133 1.7h3.135v-1.7h-2.002zm2.002 3H6.65v7.7h10.7v-7.7zm-10.7-1.3h2.002l1.134-1.7H6.65v1.7zm3.858 2.4a.65.65 0 0 1 .65 0l3.5 2.02a.65.65 0 0 1 0 1.126l-3.5 2.02a.65.65 0 0 1-.975-.562v-4.042a.65.65 0 0 1 .325-.563zm.975 1.688v1.79l1.55-.895-1.55-.895z' fill='%23506176'/%3E%3C/svg%3E") no-repeat center/100%;
    //}
    //
    //.ql-blockquote::before {
    //  display: block;
    //  content: '';
    //  width: 24px;
    //  height: 24px;
    //  background: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.055 15.547C6.37 14.817 6 13.999 6 12.674c0-2.334 1.638-4.425 4.02-5.46l.595.92c-2.223 1.202-2.658 2.763-2.831 3.747.358-.186.827-.25 1.286-.207 1.203.11 2.15 1.098 2.15 2.325a2.333 2.333 0 0 1-2.333 2.334 2.58 2.58 0 0 1-1.832-.786zm6.667 0c-.687-.73-1.055-1.548-1.055-2.873 0-2.334 1.638-4.425 4.02-5.46l.595.92c-2.223 1.202-2.658 2.763-2.831 3.747.358-.186.826-.25 1.286-.207 1.202.11 2.15 1.098 2.15 2.325a2.333 2.333 0 0 1-2.333 2.334 2.58 2.58 0 0 1-1.832-.786z' fill='%23506176'/%3E%3C/svg%3E") no-repeat center/100%;
    //}
    //
    //.ql-code-block::before {
    //  display: block;
    //    content: '';
    //    width: 24px;
    //    height: 24px;
    //    background: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8.72 7.22a.75.75 0 0 1 1.06 1.06L6.06 12l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25zm6.56 0a.75.75 0 1 0-1.06 1.06L17.94 12l-3.72 3.72a.75.75 0 1 0 1.06 1.06l4.25-4.25a.75.75 0 0 0 0-1.06l-4.25-4.25z' fill='%23506176'/%3E%3C/svg%3E") no-repeat center/100%;
    //  }
    //
    //  .ql-list[value="bullet"]::before {
    //      display: block;
    //      content: '';
    //      width: 24px;
    //      height: 24px;
    //      background: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M6 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3.75-1.5a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5zm0 5a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5zm0 5a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5zM7 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z' fill='%23506176'/%3E%3C/svg%3E") no-repeat center/100%;
    //  }
    //  
    //  .ql-list[value="ordered"] {
    //    display: block;
    //    content: '';
    //    width: 24px;
    //    height: 24px;
    //    background: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_5445_38276)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M6.003 6.5a.5.5 0 0 0-.723-.447l-1.003.5a.5.5 0 1 0 .446.895l.28-.14V10H4.5a.5.5 0 1 0 0 1h2.006a.5.5 0 0 0 0-1h-.503V6.5zM9 7.25a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 9 7.25zm0 5a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1-.75-.75zm0 5a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1-.75-.75zm-4.076-2.93l.003-.004a.851.851 0 0 1 .144-.153A.66.66 0 0 1 5.5 14c.195 0 .306.068.374.146a.57.57 0 0 1 .128.376c0 .453-.269.682-.8 1.078l-.035.025C4.692 15.98 4 16.494 4 17.5a.5.5 0 0 0 .5.5h2.003a.5.5 0 0 0 0-1H5.146c.132-.197.351-.372.654-.597l.047-.035c.47-.35 1.156-.858 1.156-1.845 0-.365-.118-.744-.377-1.038-.268-.303-.658-.484-1.126-.484-.48 0-.84.202-1.068.392a1.855 1.855 0 0 0-.348.384l-.007.011-.002.005-.001.001-.001.001a.5.5 0 0 0 .851.525zm-.424-.265l-.427-.26.427.26z' fill='%23506176'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_5445_38276'%3E%3Cpath fill='%23fff' transform='translate(4 4)' d='M0 0h16v16H0z'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E") no-repeat center/100%;
    //  }
    //
    //  .ql-indent[value="-1"] {
    //    display: block;
    //    content: '';
    //    width: 24px;
    //    height: 24px;
    //    background: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.464 6.887c0-.4.325-.726.727-.726H17.81a.726.726 0 1 1 0 1.453H6.19a.726.726 0 0 1-.726-.727zm0 10.893c0-.4.325-.726.727-.726H17.81a.726.726 0 0 1 0 1.453H6.19a.726.726 0 0 1-.726-.727zm5.81-3.63c0-.402.325-.727.726-.727h5.81a.726.726 0 1 1 0 1.453H12a.726.726 0 0 1-.726-.727zm0-3.632c0-.4.325-.726.726-.726h5.81a.726.726 0 1 1 0 1.453H12a.726.726 0 0 1-.726-.727zm-5.305 2.258a.587.587 0 0 1 0-.884l2.01-1.76a.235.235 0 0 1 .39.178v4.048c0 .202-.237.31-.39.177l-2.01-1.76z' fill='%23506176'/%3E%3C/svg%3E") no-repeat center/100%;
    //  }
    //
    //  .ql-indent[value="+1"] {
    //    display: block;
    //    content: '';
    //    width: 24px;
    //    height: 24px;
    //    background: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.464 6.885c0-.4.325-.726.726-.726h11.62a.726.726 0 1 1 0 1.453H6.19a.726.726 0 0 1-.726-.727zm0 10.893c0-.401.325-.726.726-.726h11.62a.726.726 0 1 1 0 1.452H6.19a.726.726 0 0 1-.726-.726zm5.81-3.631c0-.401.325-.726.726-.726h5.81a.726.726 0 1 1 0 1.452H12a.726.726 0 0 1-.726-.726zm0-3.63c0-.402.325-.727.726-.727h5.81a.726.726 0 1 1 0 1.452H12a.726.726 0 0 1-.726-.726zm-3.41 1.373a.587.587 0 0 1 0 .883l-2.01 1.76a.235.235 0 0 1-.39-.177v-4.049c0-.201.237-.31.39-.176l2.01 1.759z' fill='%23506176'/%3E%3C/svg%3E") no-repeat center/100%;
    //  }
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
    background: #F6F7FA;
  }

  option {
    display: block;
  }

  .ql-toolbar, .ql-formats {
    display: flex;
    flex-wrap: nowrap;
    background: #F6F7FA;
  }

  .ql-toolbar {
    align-items: center;
    height: 40px;
  }

  .ql-formats {
    gap: 8px;
  }

  .ql-formats button {
    padding: 0;
  }

  .ql-picker.ql-header .ql-picker-label::before,
  .ql-header .ql-picker-item::before {
    display: block;
    content: 'Normal';
  }

  .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
  .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: 'Heading 1';
  }

  .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
  .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: 'Heading 2';
  }

  .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
  .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: 'Heading 3';
  }

  .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
  .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: 'Heading 4';
  }

  .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
  .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: 'Heading 5';
  }

  .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
  .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: 'Heading 6';
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
    content: 'Sans Serif';
  }

  .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
  .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
    content: 'Serif';
  }

  .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
  .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
    content: 'Monospace';
  }

  .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
    font-family: Georgia, Times New Roman, serif;
  }

  .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
    font-family: Monaco, Courier New, monospace;
  }

  .ql-picker.ql-size {
    width: 98px;
  }

  .ql-picker.ql-size .ql-picker-label::before,
  .ql-picker.ql-size .ql-picker-item::before {
    content: 'Normal';
  }

  .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
  .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
    content: 'Small';
  }

  .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
  .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
    content: 'Large';
  }

  .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
  .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
    content: 'Huge';
  }

  .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
    font-size: 10px;
  }

  .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
    font-size: 18px;
  }

  .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
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
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    padding: 8px;
    padding-left: 200px;
    height: 40px;
    border-bottom: 1px solid #E0E4EB;
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

  .ql-tooltip input[type=text] {
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
    content: 'Edit';
    margin-left: 16px;
    padding-right: 8px;
  }

  .ql-tooltip a.ql-remove::before {
    content: 'Remove';
    margin-left: 8px;
  }

  .ql-tooltip a {
    line-height: 26px;
  }

  .ql-tooltip.ql-editing a.ql-preview,
  .ql-tooltip.ql-editing a.ql-remove {
    display: none;
  }

  .ql-tooltip.ql-editing input[type=text] {
    display: inline-block;
  }

  .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: 'Save';
    padding-right: 0px;
  }

  .ql-tooltip[data-mode=link]::before {
    content: "Enter link:";
  }

  .ql-tooltip[data-mode=formula]::before {
    content: "Enter formula:";
  }

  .ql-tooltip[data-mode=video]::before {
    content: "Enter video:";
  }

  a {
    color: #06c;
  }
`;


const icons = Quill.import("ui/icons");
icons["bold"] = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 2C3.44772 2 3 2.44772 3 3V8V13C3 13.5523 3.44772 14 4 14H9.5C11.433 14 13 12.433 13 10.5C13 9.24701 12.3416 8.14781 11.3519 7.52949C11.7599 6.95707 12 6.25657 12 5.5C12 3.567 10.433 2 8.5 2H4ZM8.5 7C9.32843 7 10 6.32843 10 5.5C10 4.67157 9.32843 4 8.5 4H5V7H8.5ZM5 9V12H9.5C10.3284 12 11 11.3284 11 10.5C11 9.67157 10.3284 9 9.5 9H8.5H5Z" fill="#506176"/></svg>`;
icons["underline"] = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.29725 1.30762C4.70622 1.30762 5.03777 1.63916 5.03777 2.04814V7.28694C5.03777 8.07253 5.34984 8.82595 5.90534 9.38144C6.46084 9.93694 7.21426 10.249 7.99985 10.249C8.78544 10.249 9.53886 9.93694 10.0944 9.38144C10.6499 8.82595 10.9619 8.07253 10.9619 7.28694V2.04814C10.9619 1.63916 11.2935 1.30762 11.7025 1.30762C12.1114 1.30762 12.443 1.63916 12.443 2.04814V7.28694C12.443 8.46533 11.9749 9.59545 11.1416 10.4287C10.3084 11.2619 9.17824 11.7301 7.99985 11.7301C6.82146 11.7301 5.69133 11.2619 4.85809 10.4287C4.02484 9.59545 3.55673 8.46533 3.55673 7.28694V2.04814C3.55673 1.63916 3.88827 1.30762 4.29725 1.30762ZM2.07568 13.9516C2.07568 13.5426 2.40723 13.2111 2.8162 13.2111H13.1835C13.5925 13.2111 13.924 13.5426 13.924 13.9516C13.924 14.3606 13.5925 14.6921 13.1835 14.6921H2.8162C2.40723 14.6921 2.07568 14.3606 2.07568 13.9516Z" fill="#506176"/>
</svg>
`;
icons["strike"] = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.1343 9.60413C12.3188 10.0181 12.4118 10.4785 12.4118 10.9839C12.4118 12.0605 11.9915 12.9028 11.1516 13.5085C10.31 14.1142 9.14924 14.4174 7.66756 14.4174C6.50209 14.4174 5.34733 14.1775 4.20271 13.6973C3.9301 13.5829 3.7608 13.3112 3.7608 13.0156C3.7608 12.4263 4.40477 12.0516 4.95484 12.263C5.79149 12.5846 6.6411 12.7456 7.50391 12.7456C9.55035 12.7456 10.5764 12.1584 10.5836 10.9831C10.5878 10.7448 10.544 10.5082 10.4547 10.2872C10.3463 10.0191 10.172 9.80275 9.9675 9.60333H0.779785V7.99891H15.2196V9.60333L12.1343 9.60413ZM8.86285 7.1975H4.49322C4.35269 7.06937 4.22358 6.92926 4.10735 6.77875C3.7608 6.33111 3.58752 5.79042 3.58752 5.15347C3.58752 4.16194 3.96135 3.31882 4.70821 2.6241C5.45667 1.92939 6.61265 1.58203 8.17777 1.58203C9.20623 1.58203 10.1963 1.7819 11.1469 2.18163C11.4058 2.29047 11.5647 2.5495 11.5647 2.8303C11.5647 3.3948 10.9454 3.75845 10.4089 3.58295C9.77395 3.37524 9.10411 3.27148 8.39918 3.27148C6.4097 3.27148 5.41576 3.89881 5.41576 5.15347C5.41576 5.4904 5.59064 5.78401 5.9404 6.0351C6.29016 6.28619 6.72175 6.48594 7.23437 6.63675C7.73174 6.78115 8.27483 6.96887 8.86285 7.1975Z" fill="#506176"/>
</svg>
`;
icons["link"] = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.77518 3.27518C7.6427 3.41735 7.57057 3.6054 7.574 3.7997C7.57743 3.994 7.65614 4.17938 7.79355 4.3168C7.93097 4.45421 8.11635 4.53292 8.31065 4.53635C8.50495 4.53978 8.693 4.46766 8.83518 4.33518L10.0852 3.08518C10.271 2.89936 10.4916 2.75195 10.7344 2.65139C10.9772 2.55082 11.2374 2.49906 11.5002 2.49906C11.763 2.49906 12.0232 2.55082 12.266 2.65139C12.5088 2.75195 12.7294 2.89936 12.9152 3.08518C13.101 3.271 13.2484 3.4916 13.349 3.73438C13.4495 3.97717 13.5013 4.23739 13.5013 4.50018C13.5013 4.76297 13.4495 5.02318 13.349 5.26597C13.2484 5.50875 13.101 5.72935 12.9152 5.91518L10.4152 8.41518C10.2294 8.60113 10.0089 8.74865 9.76606 8.84929C9.52326 8.94994 9.26301 9.00175 9.00018 9.00175C8.73734 9.00175 8.47709 8.94994 8.23429 8.84929C7.9915 8.74865 7.77092 8.60113 7.58518 8.41518C7.443 8.2827 7.25495 8.21057 7.06065 8.214C6.86635 8.21743 6.68097 8.29614 6.54355 8.43355C6.40614 8.57097 6.32743 8.75635 6.324 8.95065C6.32057 9.14495 6.3927 9.333 6.52518 9.47518C6.85019 9.80022 7.23604 10.0581 7.6607 10.234C8.08536 10.4099 8.54052 10.5004 9.00018 10.5004C9.45983 10.5004 9.91499 10.4099 10.3397 10.234C10.7643 10.0581 11.1502 9.80022 11.4752 9.47518L13.9752 6.97518C14.6316 6.31876 15.0004 5.42848 15.0004 4.50018C15.0004 3.57187 14.6316 2.68159 13.9752 2.02518C13.3188 1.36876 12.4285 1 11.5002 1C10.5719 1 9.68159 1.36876 9.02517 2.02518L7.77518 3.27518ZM3.08518 12.9152C2.89922 12.7294 2.7517 12.5089 2.65106 12.2661C2.55041 12.0233 2.4986 11.763 2.4986 11.5002C2.4986 11.2374 2.55041 10.9771 2.65106 10.7343C2.7517 10.4915 2.89922 10.2709 3.08518 10.0852L5.58518 7.58518C5.77092 7.39922 5.9915 7.2517 6.23429 7.15106C6.47709 7.05041 6.73734 6.9986 7.00018 6.9986C7.26301 6.9986 7.52326 7.05041 7.76606 7.15106C8.00885 7.2517 8.22943 7.39922 8.41518 7.58518C8.55735 7.71766 8.7454 7.78978 8.9397 7.78635C9.134 7.78292 9.31938 7.70421 9.4568 7.5668C9.59421 7.42938 9.67292 7.244 9.67635 7.0497C9.67978 6.8554 9.60766 6.66735 9.47518 6.52518C9.15017 6.20013 8.76431 5.94229 8.33965 5.76638C7.91499 5.59047 7.45983 5.49992 7.00018 5.49992C6.54052 5.49992 6.08536 5.59047 5.6607 5.76638C5.23604 5.94229 4.85019 6.20013 4.52518 6.52518L2.02518 9.02517C1.36876 9.68159 1 10.5719 1 11.5002C1 12.4285 1.36876 13.3188 2.02518 13.9752C2.68159 14.6316 3.57187 15.0004 4.50018 15.0004C5.42848 15.0004 6.31876 14.6316 6.97518 13.9752L8.22518 12.7252C8.35766 12.583 8.42978 12.395 8.42635 12.2007C8.42292 12.0064 8.34421 11.821 8.2068 11.6836C8.06938 11.5462 7.884 11.4674 7.6897 11.464C7.4954 11.4606 7.30735 11.5327 7.16518 11.6652L5.91518 12.9152C5.72943 13.1011 5.50885 13.2487 5.26606 13.3493C5.02326 13.45 4.76301 13.5018 4.50018 13.5018C4.23734 13.5018 3.97709 13.45 3.73429 13.3493C3.4915 13.2487 3.27092 13.1011 3.08518 12.9152Z" fill="#506176"/>
</svg>
`;
icons["image"] = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_5445_38251)">
<path d="M14.0002 10V12H16.0002V13.3333H14.0002V15.3333H12.6668V13.3333H10.6668V12H12.6668V10H14.0002ZM14.0055 2C14.3708 2 14.6668 2.29667 14.6668 2.662V8.89467C14.2386 8.7434 13.7877 8.66629 13.3335 8.66667V3.33333H2.66683L2.6675 12.6667L8.86216 6.47133C8.9768 6.35632 9.12951 6.28715 9.29157 6.27684C9.45363 6.26653 9.61387 6.31578 9.74216 6.41533L9.80416 6.472L12.1682 8.83867C11.6513 8.99618 11.1716 9.25674 10.7581 9.60464C10.3446 9.95254 10.0059 10.3806 9.76233 10.8629C9.51875 11.3453 9.37538 11.872 9.34087 12.4113C9.30635 12.9505 9.3814 13.4912 9.5615 14.0007L1.99483 14C1.81937 13.9998 1.65116 13.93 1.52716 13.8059C1.40315 13.6817 1.3335 13.5135 1.3335 13.338V2.662C1.33472 2.48692 1.40476 2.31934 1.5285 2.19548C1.65225 2.07161 1.81975 2.0014 1.99483 2H14.0055ZM5.3335 4.66667C5.68712 4.66667 6.02626 4.80714 6.2763 5.05719C6.52635 5.30724 6.66683 5.64638 6.66683 6C6.66683 6.35362 6.52635 6.69276 6.2763 6.94281C6.02626 7.19286 5.68712 7.33333 5.3335 7.33333C4.97987 7.33333 4.64074 7.19286 4.39069 6.94281C4.14064 6.69276 4.00016 6.35362 4.00016 6C4.00016 5.64638 4.14064 5.30724 4.39069 5.05719C4.64074 4.80714 4.97987 4.66667 5.3335 4.66667Z" fill="#506176"/>
</g>
<defs>
<clipPath id="clip0_5445_38251">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>
`;
icons["video"] = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.99121 1.34968H2.0001C1.64111 1.34968 1.3501 1.64069 1.3501 1.99968V13.9997C1.3501 14.3587 1.64111 14.6497 2.0001 14.6497H14.0001C14.3591 14.6497 14.6501 14.3587 14.6501 13.9997V5.0008C14.6501 5.00043 14.6501 5.00005 14.6501 4.99968C14.6501 4.9993 14.6501 4.99893 14.6501 4.99855V1.99968C14.6501 1.64069 14.3591 1.34968 14.0001 1.34968H11.0102C11.0039 1.34959 10.9975 1.34959 10.9912 1.34968H7.01018C7.00385 1.34959 6.99753 1.34959 6.99121 1.34968ZM9.78556 2.64968H7.34797L6.21463 4.34968H8.65223L9.78556 2.64968ZM11.348 2.64968L10.2146 4.34968H13.3501V2.64968H11.348ZM13.3501 5.64968H9.00898C9.00267 5.64977 8.99634 5.64977 8.99002 5.64968H5.00898C5.00267 5.64977 4.99634 5.64977 4.99002 5.64968H2.6501V13.3497H13.3501V5.64968ZM2.6501 4.34968H4.65223L5.78556 2.64968H2.6501V4.34968ZM6.50843 6.74941C6.70954 6.6333 6.95732 6.6333 7.15843 6.74941L10.6584 8.77015C10.8595 8.88626 10.9834 9.10084 10.9834 9.33306C10.9834 9.56528 10.8595 9.77987 10.6584 9.89598L7.15843 11.9167C6.95732 12.0328 6.70954 12.0328 6.50843 11.9167C6.30732 11.8006 6.18343 11.586 6.18343 11.3538V7.31233C6.18343 7.08011 6.30732 6.86552 6.50843 6.74941ZM7.48343 8.43816V10.228L9.03343 9.33306L7.48343 8.43816Z" fill="#506176"/>
</svg>
`;
icons["blockquote"] = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.05533 11.5468C2.36867 10.8175 2 9.99951 2 8.67351C2 6.34018 3.638 4.24884 6.02 3.21484L6.61533 4.13351C4.392 5.33618 3.95733 6.89684 3.784 7.88084C4.142 7.69551 4.61067 7.63084 5.07 7.67351C6.27267 7.78484 7.22067 8.77218 7.22067 9.99951C7.22067 10.6183 6.97483 11.2118 6.53725 11.6494C6.09966 12.087 5.50617 12.3328 4.88733 12.3328C4.172 12.3328 3.488 12.0062 3.05533 11.5468V11.5468ZM9.722 11.5468C9.03533 10.8175 8.66667 9.99951 8.66667 8.67351C8.66667 6.34018 10.3047 4.24884 12.6867 3.21484L13.282 4.13351C11.0587 5.33618 10.624 6.89684 10.4507 7.88084C10.8087 7.69551 11.2773 7.63084 11.7367 7.67351C12.9393 7.78484 13.8873 8.77218 13.8873 9.99951C13.8873 10.6183 13.6415 11.2118 13.2039 11.6494C12.7663 12.087 12.1728 12.3328 11.554 12.3328C10.8387 12.3328 10.1547 12.0062 9.722 11.5468V11.5468Z" fill="#506176"/>
</svg>
`;
icons["code-block"] = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M4.71967 3.21967C5.01256 2.92678 5.48744 2.92678 5.78033 3.21967C6.07322 3.51256 6.07322 3.98744 5.78033 4.28033L2.06066 8L5.78033 11.7197C6.07322 12.0126 6.07322 12.4874 5.78033 12.7803C5.48744 13.0732 5.01256 13.0732 4.71967 12.7803L0.46967 8.53033C0.176777 8.23744 0.176777 7.76256 0.46967 7.46967L4.71967 3.21967ZM11.2803 3.21967C10.9874 2.92678 10.5126 2.92678 10.2197 3.21967C9.92678 3.51256 9.92678 3.98744 10.2197 4.28033L13.9393 8L10.2197 11.7197C9.92678 12.0126 9.92678 12.4874 10.2197 12.7803C10.5126 13.0732 10.9874 13.0732 11.2803 12.7803L15.5303 8.53033C15.8232 8.23744 15.8232 7.76256 15.5303 7.46967L11.2803 3.21967Z" fill="#506176"/>
</svg>
`;
icons["list"] = {
  ordered: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_5445_38277)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.00337 2.50005C2.00337 2.32685 1.91375 2.16599 1.76648 2.07484C1.61921 1.9837 1.43526 1.97525 1.28025 2.05252L0.277079 2.55256C0.0299152 2.67576 -0.0705754 2.976 0.0526264 3.22317C0.175828 3.47033 0.476068 3.57082 0.723232 3.44762L1.00328 3.30802V6.00036H0.500155C0.223988 6.00036 0.000110023 6.22424 0.000110023 6.50041C0.000110023 6.77657 0.223988 7.00045 0.500155 7.00045H2.5065C2.78267 7.00045 3.00655 6.77657 3.00655 6.50041C3.00655 6.22424 2.78267 6.00036 2.5065 6.00036H2.00337V2.50005ZM5 3.25C5 2.83579 5.33579 2.5 5.75 2.5H14.25C14.6642 2.5 15 2.83579 15 3.25C15 3.66421 14.6642 4 14.25 4H5.75C5.33579 4 5 3.66421 5 3.25ZM5 8.25C5 7.83579 5.33579 7.5 5.75 7.5H14.25C14.6642 7.5 15 7.83579 15 8.25C15 8.66421 14.6642 9 14.25 9H5.75C5.33579 9 5 8.66421 5 8.25ZM5 13.25C5 12.8358 5.33579 12.5 5.75 12.5H14.25C14.6642 12.5 15 12.8358 15 13.25C15 13.6642 14.6642 14 14.25 14H5.75C5.33579 14 5 13.6642 5 13.25ZM0.924398 10.32L0.927032 10.3161C0.931315 10.3099 0.939805 10.2981 0.952393 10.2825C0.978004 10.2507 1.01787 10.2066 1.07075 10.1628C1.17619 10.0753 1.31709 10.0007 1.50025 10.0007C1.69557 10.0007 1.80717 10.0693 1.87542 10.1467C1.95169 10.2332 2.00312 10.366 2.00312 10.5231C2.00312 10.9755 1.73398 11.2053 1.20308 11.6005L1.16805 11.6265C0.6919 11.9803 0.000122084 12.4944 0.000122084 13.4999C0.000122084 13.6325 0.0528052 13.7597 0.146582 13.8535C0.240359 13.9473 0.367547 14 0.500167 14H2.50309C2.77926 14 3.00321 13.7761 3.00321 13.4999C3.00321 13.2238 2.77933 12.9999 2.50317 12.9999H1.14611C1.27778 12.8026 1.49742 12.6281 1.80025 12.4027L1.84691 12.368C2.31766 12.0188 3.00321 11.5101 3.00321 10.5231C3.00321 10.1578 2.88489 9.77939 2.62556 9.48527C2.35821 9.18206 1.96836 9.00062 1.50027 9.00061C1.02002 9.0006 0.66087 9.20333 0.432114 9.39315C0.317894 9.48793 0.232132 9.58249 0.173885 9.65472C0.144543 9.69111 0.121547 9.72262 0.104827 9.74677C0.0964494 9.75887 0.0895948 9.76919 0.0842568 9.77744L0.0773676 9.78826L0.0747623 9.79245L0.0736683 9.79423L0.072939 9.79543C-0.070366 10.0315 0.00461414 10.3394 0.24069 10.4827C0.47501 10.625 0.779746 10.5519 0.924398 10.32ZM0.500117 10.0552L0.072939 9.79543C0.072939 9.79543 0.0727131 9.7958 0.500117 10.0552Z" fill="#506176"/>
</g>
<defs>
<clipPath id="clip0_5445_38277">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>
`,
  bullet: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2 4C2.55228 4 3 3.55228 3 3C3 2.44772 2.55228 2 2 2C1.44772 2 1 2.44772 1 3C1 3.55228 1.44772 4 2 4ZM5.75 2.5C5.33579 2.5 5 2.83579 5 3.25C5 3.66421 5.33579 4 5.75 4H14.25C14.6642 4 15 3.66421 15 3.25C15 2.83579 14.6642 2.5 14.25 2.5H5.75ZM5.75 7.5C5.33579 7.5 5 7.83579 5 8.25C5 8.66421 5.33579 9 5.75 9H14.25C14.6642 9 15 8.66421 15 8.25C15 7.83579 14.6642 7.5 14.25 7.5H5.75ZM5.75 12.5C5.33579 12.5 5 12.8358 5 13.25C5 13.6642 5.33579 14 5.75 14H14.25C14.6642 14 15 13.6642 15 13.25C15 12.8358 14.6642 12.5 14.25 12.5H5.75ZM3 8C3 8.55228 2.55228 9 2 9C1.44772 9 1 8.55228 1 8C1 7.44772 1.44772 7 2 7C2.55228 7 3 7.44772 3 8ZM2 14C2.55228 14 3 13.5523 3 13C3 12.4477 2.55228 12 2 12C1.44772 12 1 12.4477 1 13C1 13.5523 1.44772 14 2 14Z" fill="#506176"/>
</svg>`
};
icons["align"] = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.42864 2.5C2.03416 2.5 1.71436 2.83579 1.71436 3.25C1.71436 3.66421 2.03416 4 2.42864 4H13.5715C13.966 4 14.2858 3.66421 14.2858 3.25C14.2858 2.83579 13.966 2.5 13.5715 2.5H2.42864Z" fill="#506176"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.28557 5.71387C4.89109 5.71387 4.57129 6.04966 4.57129 6.46387C4.57129 6.87808 4.89109 7.21387 5.28557 7.21387H10.7141C11.1086 7.21387 11.4284 6.87808 11.4284 6.46387C11.4284 6.04966 11.1086 5.71387 10.7141 5.71387H5.28557Z" fill="#506176"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.28557 12.5713C4.89109 12.5713 4.57129 12.9071 4.57129 13.3213C4.57129 13.7355 4.89109 14.0713 5.28557 14.0713H10.7141C11.1086 14.0713 11.4284 13.7355 11.4284 13.3213C11.4284 12.9071 11.1086 12.5713 10.7141 12.5713H5.28557Z" fill="#506176"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.42864 9.14258C2.03416 9.14258 1.71436 9.47837 1.71436 9.89258C1.71436 10.3068 2.03416 10.6426 2.42864 10.6426H13.5715C13.966 10.6426 14.2858 10.3068 14.2858 9.89258C14.2858 9.47837 13.966 9.14258 13.5715 9.14258H2.42864Z" fill="#506176"/>
</svg>`;
icons["indent"] = {
  "+1": `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.46387 2.88535C1.46387 2.4843 1.78898 2.15918 2.19004 2.15918H13.8101C14.2112 2.15918 14.5363 2.4843 14.5363 2.88535C14.5363 3.2864 14.2112 3.61152 13.8101 3.61152H2.19004C1.78898 3.61152 1.46387 3.2864 1.46387 2.88535ZM1.46387 13.7779C1.46387 13.3768 1.78898 13.0517 2.19004 13.0517H13.8101C14.2112 13.0517 14.5363 13.3768 14.5363 13.7779C14.5363 14.1789 14.2112 14.5041 13.8101 14.5041H2.19003C1.78898 14.5041 1.46387 14.1789 1.46387 13.7779ZM7.27383 10.147C7.27383 9.74599 7.59895 9.42087 8 9.42087H13.8101C14.2112 9.42087 14.5363 9.74599 14.5363 10.147C14.5363 10.5481 14.2112 10.8732 13.8101 10.8732H8C7.59895 10.8732 7.27383 10.5481 7.27383 10.147ZM7.27383 6.51619C7.27383 6.11514 7.59895 5.79003 8 5.79003H13.8101C14.2112 5.79003 14.5363 6.11514 14.5363 6.51619C14.5363 6.91725 14.2112 7.24236 13.8101 7.24236H8C7.59895 7.24236 7.27383 6.91725 7.27383 6.51619ZM3.86413 7.89004C4.13132 8.1238 4.13132 8.53944 3.86413 8.7732L1.8531 10.5327C1.70135 10.6654 1.46387 10.5577 1.46387 10.356V6.3072C1.46387 6.10557 1.70135 5.9978 1.8531 6.13057L3.86413 7.89004Z" fill="#506176"/>
</svg>`,
  "-1": `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.46436 2.88734C1.46436 2.48627 1.78949 2.16113 2.19056 2.16113H13.8099C14.211 2.16113 14.5361 2.48627 14.5361 2.88734C14.5361 3.28841 14.211 3.61355 13.8099 3.61355H2.19056C1.78949 3.61355 1.46436 3.28841 1.46436 2.88734ZM1.46436 13.7804C1.46436 13.3794 1.78949 13.0542 2.19056 13.0542H13.8099C14.211 13.0542 14.5361 13.3794 14.5361 13.7804C14.5361 14.1815 14.211 14.5067 13.8099 14.5067H2.19056C1.78949 14.5067 1.46436 14.1815 1.46436 13.7804ZM7.27401 10.1494C7.27401 9.74834 7.59915 9.42321 8.00022 9.42321H13.8099C14.211 9.42321 14.5361 9.74834 14.5361 10.1494C14.5361 10.5505 14.211 10.8756 13.8099 10.8756H8.00022C7.59915 10.8756 7.27401 10.5505 7.27401 10.1494ZM7.27401 6.51838C7.27401 6.1173 7.59915 5.79217 8.00022 5.79217H13.8099C14.211 5.79217 14.5361 6.1173 14.5361 6.51838C14.5361 6.91945 14.211 7.24458 13.8099 7.24458H8.00022C7.59915 7.24458 7.27401 6.91945 7.27401 6.51838ZM1.96911 8.77556C1.7019 8.54174 1.7019 8.12605 1.96911 7.89223L3.97986 6.13283C4.13164 6.00002 4.36918 6.10781 4.36918 6.3095V10.3583C4.36918 10.56 4.13164 10.6678 3.97986 10.535L1.96911 8.77556Z" fill="#506176"/>
</svg>`
};
icons["table"] = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1 2.67897C1 2.30398 1.27842 2 1.62187 2H14.3781C14.7216 2 15 2.30398 15 2.67897V13.821C15 14.196 14.7216 14.5 14.3781 14.5H1.62187C1.27842 14.5 1 14.196 1 13.821C1 10.107 1 6.39299 1 2.67897ZM2.24374 7.18802V9.48624H5.14579V7.18802H2.24374ZM2.24374 5.83008V3.35794H13.7563V5.83008H2.24374ZM6.38952 7.18802V9.48624H9.61048V7.18802H6.38952ZM10.8542 7.18802V9.48624H13.7563V7.18802H10.8542ZM13.7563 10.8442H10.8542V13.1421H13.7563V10.8442ZM9.61048 13.1421V10.8442H6.38952V13.1421H9.61048ZM5.14579 13.1421V10.8442H2.24374V13.1421H5.14579Z" fill="#506176"/>
</svg>
`;

export default function WYSIWYG(props: any) {

  const [isPreview, setIsPreview] = useState(false);

  const defaultModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "underline", "strike"],
        ["link", "image", "video"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }]
      ]
    }
  }), []);

  const getEditorConfig = (): QuillOptions => {
    return {
      bounds: props.bounds,
      formats: props.formats,
      modules: defaultModules,
      placeholder: props.placeholder,
      readOnly: props.readOnly,
      scrollingContainer: props.scrollingContainer,
      tabIndex: props.tabIndex,
      theme: props.theme ?? "snow"
    };
  };

  const generation = 0;

  const [editingArea, setEditingArea] = React.useState<React.ReactInstance | null>(null);


//   const onEditorChangeText = (
//     value: string,
//     delta: DeltaStatic,
//     source: Sources,
//     editor: UnprivilegedEditor,
// ): void => {
//     if (editor) return;
//
//   // We keep storing the same type of value as what the user gives us,
//   // so that value comparisons will be more stable and predictable.
//   const nextContents = isDelta(value)
//     ? editor.getContents()
//     : editor.getHTML();
//
//   if (nextContents !== getEditorContents()) {
//     // Taint this `delta` object, so we can recognize whether the user
//     // is trying to send it back as `value`, preventing a likely loop.
//     lastDeltaChangeSet = delta;
//
//     value = nextContents;
//     props?.onChange?.(value, delta, source, editor);
//   }
// }

  // const onEditorChange = (
  //   eventName: 'text-change' | 'selection-change',
  //   rangeOrDelta: Range ,
  //   oldRangeOrDelta: Range ,
  //   source: Sources,
  // ) => {
  //   if (eventName === 'text-change') {
  //     onEditorChangeText?.(
  //       editor!.root.innerHTML,
  //       rangeOrDelta as DeltaStatic,
  //       source,
  //       this.unprivilegedEditor!
  //     );
  //   } else if (eventName === 'selection-change') {
  //     onEditorChangeSelection?.(
  //       rangeOrDelta as RangeStatic,
  //       source,
  //       unprivilegedEditor!
  //     );
  //   }
  // };

  const setEditorTabIndex = (editor: Quill, tabIndex: number) => {
    if (editor?.scroll?.domNode) {
      (editor.scroll.domNode as HTMLElement).tabIndex = tabIndex;
    }
  };

  const hookEditor = (editor: Quill) => {
    // Expose the editor on change events via a weaker, unprivileged proxy
    // object that does not allow accidentally modifying editor state.
    // unprivilegedEditor = makeUnprivilegedEditor(editor);
    // Using `editor-change` allows picking up silent updates, like selection
    // changes on typing.
    // editor.on('editor-change', onEditorChange);
  };


  /**
   Creates an editor on the given element. The editor will be passed the
   configuration, have its events bound,
   */
  const createEditor = (element: Element, config: QuillOptions) => {
    const editor = new Quill(element, config);
    if (config.tabIndex != null) {
      setEditorTabIndex(editor, config.tabIndex);
    }
    hookEditor(editor);
    return editor;
  };

  const properties = {
    key: generation,
    ref: (instance: React.ReactInstance | null) => {
      setEditingArea(instance);
    }
  };

  useEffect(() => {
    if (editingArea) {
      const element = ReactDOM.findDOMNode(editingArea);
      createEditor(element as Element, getEditorConfig());
    }
  }, [editingArea]);


  return <Wrapper isPreview={isPreview}>
    <StateToggle>
      <button onClick={() => setIsPreview(false)} className={isPreview ? "" : "active"}>Write
      </button>
      <VerticalDivider />
      <button onClick={() => setIsPreview(true)} className={isPreview ? "active" : ""}>Preview
      </button>
      <VerticalDivider />
    </StateToggle>
    <div {...properties} />
  </Wrapper>;
}
