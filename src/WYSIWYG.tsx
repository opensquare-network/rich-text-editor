import React, { useEffect, useMemo } from "react";
import ReactDOM from 'react-dom';

import Quill, {
  QuillOptionsStatic,
  RangeStatic,
  BoundsStatic,
  StringMap,
  Sources,
} from 'quill';
import styled from "styled-components";

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

const Wrapper = styled.div`
  border: 1px solid #E0E4EB;
  border-radius: 4px;

  .ql-editor {
    min-height: 200px;
  }

  
  .ql-toolbar{
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
    padding: 12px 15px;
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
    color: #06c;
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
    fill: #06c;
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
    stroke: #06c;
  }

  @media (pointer: coarse) {
    .ql-snow.ql-toolbar button:hover:not(.ql-active),
    .ql-toolbar button:hover:not(.ql-active) {
      color: #444;
    }

    .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-fill,
    .ql-toolbar button:hover:not(.ql-active) .ql-fill,
    .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill,
    .ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill {
      fill: #444;
    }

    .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke,
    .ql-toolbar button:hover:not(.ql-active) .ql-stroke,
    .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter,
    .ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter {
      stroke: #444;
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
    stroke: #444;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
  }

  .ql-stroke-miter {
    fill: none;
    stroke: #444;
    stroke-miterlimit: 10;
    stroke-width: 2;
  }

  .ql-fill,
  .ql-stroke.ql-fill {
    fill: #444;
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
    color: #444;
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
    padding-right: 2px;
    position: relative;
    width: 100%;
  }

  .ql-picker-label::before {
    display: inline-block;
    line-height: 22px;
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
  }

  .ql-picker.ql-header .ql-picker-label[data-label]:not([data-label=''])::before,
  .ql-picker.ql-font .ql-picker-label[data-label]:not([data-label=''])::before,
  .ql-picker.ql-size .ql-picker-label[data-label]:not([data-label=''])::before,
  .ql-picker.ql-header .ql-picker-item[data-label]:not([data-label=''])::before,
  .ql-picker.ql-font .ql-picker-item[data-label]:not([data-label=''])::before,
  .ql-picker.ql-size .ql-picker-item[data-label]:not([data-label=''])::before {
    content: attr(data-label);
  }
  
  .ql-formats{
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
    color: #444;
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

  .ql-toolbar{
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
  .ql-header option::before {
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
    height: 40px;
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
    color: #444;
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

  .ql-container {
    border: 1px solid #ccc;
  }
  
  option{ 
    background-color: red !important;
  }
`



const icons = Quill.import("ui/icons");
icons["bold"] =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 2C3.44772 2 3 2.44772 3 3V8V13C3 13.5523 3.44772 14 4 14H9.5C11.433 14 13 12.433 13 10.5C13 9.24701 12.3416 8.14781 11.3519 7.52949C11.7599 6.95707 12 6.25657 12 5.5C12 3.567 10.433 2 8.5 2H4ZM8.5 7C9.32843 7 10 6.32843 10 5.5C10 4.67157 9.32843 4 8.5 4H5V7H8.5ZM5 9V12H9.5C10.3284 12 11 11.3284 11 10.5C11 9.67157 10.3284 9 9.5 9H8.5H5Z"/></svg>';

export default function WYSIWYG(props:any){

  const defaultModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "underline", "strike"],
        ["link", "image", "video"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
      ],
    },
  }), []);

  const getEditorConfig = (): QuillOptions  =>{
    return {
      bounds: props.bounds,
      formats: props.formats,
      modules: defaultModules,
      placeholder: props.placeholder,
      readOnly: props.readOnly,
      scrollingContainer: props.scrollingContainer,
      tabIndex: props.tabIndex,
      theme: props.theme ?? "snow",
    };
  }
  
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

  const setEditorTabIndex = (editor: Quill, tabIndex: number)  => {
    if (editor?.scroll?.domNode) {
      (editor.scroll.domNode as HTMLElement).tabIndex = tabIndex;
    }
  }

    const hookEditor = (editor: Quill) => {
      // Expose the editor on change events via a weaker, unprivileged proxy
      // object that does not allow accidentally modifying editor state.
      // unprivilegedEditor = makeUnprivilegedEditor(editor);
      // Using `editor-change` allows picking up silent updates, like selection
      // changes on typing.
      // editor.on('editor-change', onEditorChange);
    }


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
  }

  const properties = {
    key: generation,
    ref: (instance: React.ReactInstance | null) => {
      setEditingArea(instance);
    },
  };

  useEffect(()=>{
    if(editingArea){
      const element = ReactDOM.findDOMNode(editingArea);
      createEditor(element as Element, getEditorConfig())
    }
  }, [editingArea]);


  return <Wrapper>
    <div {...properties}/>
  </Wrapper>
}
