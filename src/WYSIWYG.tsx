import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import ReactDOM from "react-dom";
import quillStyle from "./styles/quillStyle";
import * as QuillNamespace from "quill";
import { BoundsStatic, QuillOptionsStatic, Sources, StringMap } from "quill";
import styled from "styled-components";
import { Delta } from "framer-motion";
import StateToggle from "./components/StateToggle";
import overrideIcons from "./util/overrideIcons";
import Mention from "./quillModules/mention";
import ImageResize from "./quillModules/ImageResize";
import { Suggestion } from "./interfaces";
import {
  HtmlPreviewer,
  renderMentionIdentityUserPlugin,
  Plugin as PreviewerPlugin
} from "@osn/previewer";
import PreviewWrapper from "./components/PreviewWrapper";
import { isAddress } from "@polkadot/util-crypto";

let Quill: any = QuillNamespace;
if (Quill.default) {
  Quill = Quill.default;
}
Quill.register("modules/mention", Mention);
Quill.register("modules/ImageResize", ImageResize);

export interface OptionalAttributes {
  attributes?: StringMap;
}

type DeltaOperation = {
  insert?: any;
  delete?: number;
  retain?: number;
} & OptionalAttributes;

interface DeltaStatic {
  ops?: DeltaOperation[];

  retain(length: number, attributes?: StringMap): DeltaStatic;

  delete(length: number): DeltaStatic;

  filter(predicate: (op: DeltaOperation) => boolean): DeltaOperation[];

  forEach(predicate: (op: DeltaOperation) => void): void;

  insert(text: any, attributes?: StringMap): DeltaStatic;

  map<T>(predicate: (op: DeltaOperation) => T): T[];

  partition(
    predicate: (op: DeltaOperation) => boolean
  ): [DeltaOperation[], DeltaOperation[]];

  reduce<T>(
    predicate: (
      acc: T,
      curr: DeltaOperation,
      idx: number,
      arr: DeltaOperation[]
    ) => T,
    initial: T
  ): T;

  chop(): DeltaStatic;

  length(): number;

  slice(start?: number, end?: number): DeltaStatic;

  compose(other: DeltaStatic): DeltaStatic;

  concat(other: DeltaStatic): DeltaStatic;

  diff(other: DeltaStatic, index?: number): DeltaStatic;

  eachLine(
    predicate: (line: DeltaStatic, attributes: StringMap, idx: number) => any,
    newline?: string
  ): DeltaStatic;

  transform(index: number, priority?: boolean): number;

  transform(other: DeltaStatic, priority: boolean): DeltaStatic;

  transformPosition(index: number, priority?: boolean): number;
}

export interface QuillOptions extends QuillOptionsStatic {
  tabIndex?: number;
}

const VerticalDivider = styled.div`
  width: 1px;
  height: 40px;
  background-color: #e0e4eb;
`;

const Wrapper = styled.div<{ isPreview: boolean; height: number }>`
  ${quillStyle};
`;

const icons = Quill.import("ui/icons");
overrideIcons(icons);

interface EditorProps {
  value?: string;
  onChange?: (value: string) => void;
  mentions?: any[];
  setModalInsetFunc: (
    func: (bounds: BoundsStatic) => void,
    type: string
  ) => void;
  loadSuggestions?: (text: string) => Suggestion[];
  minHeight?: number;
  identifier?: ReactElement;
  setActive: (active: boolean) => void;
  setQuillRef: any;
  previewerPlugins?: PreviewerPlugin[];
}

//fixme: this a for mention insert from replay button
//find a elegant way to do this
const prettyHTML = html => {
  return html
    .replaceAll(`data-osn-polka-network`, `osn-polka-network`)
    .replaceAll(`data-osn-polka-address`, `osn-polka-address`);
};

export default function WYSIWYG(props: EditorProps) {
  const { previewerPlugins = [] } = props;
  const [isPreview, setIsPreview] = useState(false);
  const [quill, setQuill] = useState(null);
  const ref = useRef();

  useEffect(() => {
    if (props.value === "") {
      setIsPreview(false);
      if (quill) {
        quill.root.innerHTML = "";
      }
    }
  }, [props.value]);

  useEffect(() => {
    if (quill) {
      const textarea = quill.root;
      textarea.onfocus = () => {
        props.setActive(true);
      };
      textarea.onblur = () => {
        props.setActive(false);
      };
    }
  }, [quill]);

  const defaultModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "underline", "strike"],
          ["link", "image", "video"],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }]
        ],
        handlers: {
          //must be an async func so you can pass img link from other component later
          image: async function() {
            const that = this;
            new Promise(resolve => {
              props.setModalInsetFunc(function() {
                //pass resolve to ImgModal component so it can be called as resolve(link) in ImgModal, see in ImgModal.txs line 84
                return resolve;
              });
            }).then(link => {
              that.quill.focus();
              var range = that.quill.getSelection();
              that.quill.insertEmbed(range.index, "image", link, "user");
            });
          },
          video: async function() {
            const that = this;
            new Promise(resolve => {
              props.setModalInsetFunc(function() {
                //pass resolve to ImgModal component so it can be called as resolve(link) in ImgModal, see in ImgModal.txs line 84
                return resolve;
              }, "video");
            }).then(link => {
              const videoLink = link?.replace("watch?v=", "embed/");
              that.quill.focus();
              var range = that.quill.getSelection();
              that.quill.insertEmbed(range.index, "video", videoLink, "user");
            });
          }
        }
      },
      mention: {
        allowedChars: /^[0-9A-Za-z\s]*$/,
        mentionDenotationChars: ["@"],
        source: function(searchTerm: any, renderList: any, mentionChar: any) {
          const suggestions = props.loadSuggestions("") ?? [];
          const atValues: any = [];
          suggestions.map(suggestion =>
            atValues.push({
              id: suggestion.address,
              value: suggestion.preview,
              isKeyRegistered:
                suggestion?.isKeyRegistered?.toString() ?? "false",
              chain: suggestion?.chain,
              address: suggestion.address
            })
          );

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
      },
      ImageResize: {
        modules: ["Resize", "DisplaySize"]
      }
    }),
    []
  );

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

  const [
    editingArea,
    setEditingArea
  ] = React.useState<React.ReactInstance | null>(null);

  const setEditorTabIndex = (editor: Quill, tabIndex: number) => {
    if (editor?.scroll?.domNode) {
      (editor.scroll.domNode as HTMLElement).tabIndex = tabIndex;
    }
  };

  const hookEditor = (editor: Quill) => {
    // @ts-ignore
    editor.on(
      "editor-change",
      (
        eventName: "text-change" | "selection-change",
        rangeOrDelta: Delta,
        oldRangeOrDelta: Delta,
        source: Sources
      ) => {
        if (eventName === "text-change") {
          if (props?.onChange) {
            props?.onChange(editor.root.innerHTML);
          }
          editor.root.style.height = `${props.minHeight}px`;
          editor.root.style.height = `${editor.root.scrollHeight}px`;
        }
      }
    );
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
    class SyntaxCodeBlock extends editorInstance?.options?.registry?.classes[
      "ql-code-block"
    ] {}
    SyntaxCodeBlock.tagName = "PRE";
    Quill.register(SyntaxCodeBlock);
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
      setQuill(editor);
      props?.setQuillRef(editor);
    }
  }, [editingArea]);

  useEffect(() => {
    if (isPreview && ref.current) {
      setTimeout(() => {
        ref.current.querySelectorAll("span.mention").forEach(block => {
          const p = block.parentElement;
          const address = block.getAttribute("osn-polka-address");
          if (isAddress(address)) {
            const a = document.createElement("a");
            a.href = `/member/${address}`;
            a.target = "_blank";
            a.innerHTML = block.innerText;
            p.replaceChild(a, block);
          }
        });
      }, 10);
    }
  }, [isPreview, ref.current]);

  return (
    <Wrapper isPreview={isPreview} height={props.minHeight ?? 200}>
      <StateToggle>
        <button
          onClick={() => setIsPreview(false)}
          className={isPreview ? "" : "active"}
          style={{ borderTopLeftRadius: 3 }}
        >
          Write
        </button>
        <VerticalDivider />
        <button
          style={{ paddingLeft: 11 }}
          onClick={() => setIsPreview(true)}
          className={isPreview ? "active" : ""}
        >
          Preview
        </button>
        <VerticalDivider />
      </StateToggle>
      <div
        style={{ display: isPreview ? "none" : "initial" }}
        {...properties}
      />
      {isPreview && (
        <PreviewWrapper ref={ref}>
          <HtmlPreviewer
            content={prettyHTML(props.value)}
            plugins={[
              renderMentionIdentityUserPlugin(props.identifier, {
                targetElement: { tag: "span" }
              }),
              ...previewerPlugins
            ]}
            minHeight={props.minHeight - 20}
          />
        </PreviewWrapper>
      )}
    </Wrapper>
  );
}
