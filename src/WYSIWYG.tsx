import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import quillStyle from "./styles/quillStyle";
import { QuillOptionsStatic, RangeStatic, BoundsStatic, StringMap, Sources } from "quill";
// @ts-ignore
import Mention from "quill-mention";
// @ts-ignore
import ImageResize from "quill-image-resize-module";
import styled from "styled-components";
import { Delta } from "framer-motion";
import * as QuillNamespace from "quill";
import StateToggle from "./components/StateToggle";
import overrideIcons from "./util/overrideIcons";

let Quill: any = QuillNamespace;

Quill.register("modules/mention", Mention);

// Quill.register("modules/ImageResize", ImageResize);

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

const VerticalDivider = styled.div`
  width: 1px;
  height: 40px;
  background-color: #E0E4EB;
`;

const Wrapper = styled.div<{ isPreview: boolean }>`
  ${quillStyle};
`;

const icons = Quill.import("ui/icons");
overrideIcons(icons);

interface EditorProps {
  value?: string;
  onChange?: (value: string) => void;
  mentions?: any[];
}

const isDelta = (value: any): boolean => {
  return value && value.ops;
};

export default function WYSIWYG(props: EditorProps) {
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
    },
    mention: {
      allowedChars: /^[A-Za-z\s]*$/,
      mentionDenotationChars: ["@"],
      source: function(searchTerm: any, renderList: any, mentionChar: any) {
        console.log(123);
        const atValues: any = [
          { id: "123123", value: "456456" }
        ];

        let values;
        if (mentionChar === "@") {
          values = atValues;
        }
        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];
          for (let i = 0; i < values.length; i++) {
            if (
              ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
            ) {
              matches.push(values[i]);
            }
          }
          renderList(matches, searchTerm);
        }
      }
    }
    // ImageResize: {
    //   modules: ["Resize", "DisplaySize"],
    // },
  }), []);

  const getEditorConfig = (): QuillOptions => {
    return {
      bounds: props.bounds,
      formats: props.formats,
      modules: defaultModules,
      placeholder: "",
      readOnly: props.readOnly,
      scrollingContainer: props.scrollingContainer,
      tabIndex: props.tabIndex,
      theme: "snow"
    };
  };

  const generation = 0;

  const [editingArea, setEditingArea] = React.useState<React.ReactInstance | null>(null);

  const setEditorTabIndex = (editor: Quill, tabIndex: number) => {
    if (editor?.scroll?.domNode) {
      (editor.scroll.domNode as HTMLElement).tabIndex = tabIndex;
    }
  };

  const hookEditor = (editor: Quill) => {
    // @ts-ignore
    editor.on("editor-change", (
      eventName: "text-change" | "selection-change",
      rangeOrDelta: Delta,
      oldRangeOrDelta: Delta,
      source: Sources
    ) => {
      if (eventName === "text-change") {
        if (props?.onChange) {
          props?.onChange(editor.root.innerHTML);
        }
      }
    });
  };

  /**
   Creates an editor on the given element. The editor will be passed the
   configuration, have its events bound,
   */
  const createEditor = (element: Element, config: QuillOptions) => {
    const editorInstance = new Quill(element, config);
    if (config.tabIndex != null) {
      setEditorTabIndex(editorInstance, config.tabIndex);
    }
    hookEditor(editorInstance);
    return editorInstance;
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
      const editor = createEditor(element as Element, getEditorConfig());
      if (props.value) {
        editor.clipboard.dangerouslyPasteHTML(props.value);
      }
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
