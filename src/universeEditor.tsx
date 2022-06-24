import * as React from "react";
import MarkdownEditor from "../src";
import { useState } from "react";
import WYSIWYG from "../src/WYSIWYG";
import styled from "styled-components";
import Toggle from "../src/components/Toggle";
import MarkdownIcon from "../src/components/MarkdownIcon";
import InsertContentsModal from "./components/modal";

export type DemoProps = {};

const markdown = `
[https://www.baidu.com/](https://www.baidu.com/)
# heading 1
**bold text** _italic text_ \`inline code\`
- bullet 1
1. numbered 1

|table|example|index|
|-|-|-|
|table|column|1|
|table|column|2|
\`\`\`bash
echo "hello"
\`\`\`
> quote text
`.trim();

const suggestions = [
  {
    preview: <span>abc</span>,
    value: "abc"
  },
  {
    preview: <span>edf</span>,
    value: "edf"
  }
];

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 8px;
  height: 40px;
  border-top: 1px solid #ebeef4;
  padding-right: 16px;
`;

export const UniverseEditor: React.FunctionComponent<DemoProps> = () => {
  const [content, setContent] = useState(markdown);
  const [contentType, setContentType] = useState("markdown");
  const [htmlContent, setHtmlContent] = useState(`<p>　</p>`);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("image");
  const [insetQuillContentsFunc, setInsetQuillContentsFunc] = useState(null);

  const onMarkdownSwitch = () => {
    if (
      content &&
      !confirm(`Togging editor will empty all typed contents, are you sure ?`)
    ) {
      return;
    }

    const newContentType = contentType === "html" ? "markdown" : "html";
    setContent("");
    setContentType(newContentType);
  };

  return (
    <div
      style={{ maxWidth: 800, border: "1px solid #EBEEF4", borderRadius: 4 }}
    >
      {contentType === "markdown" ? (
        <MarkdownEditor
          value={content}
          onChange={value => {
            setContent(value);
          }}
          suggestions={suggestions}
          minHeight={200}
          theme={"subsquare"}
        />
      ) : (
        <>
          <InsertContentsModal
            showModal={showModal}
            setShowModal={setShowModal}
            insetQuillContentsFunc={insetQuillContentsFunc}
            type={modalType}
          />
          <WYSIWYG
            value={htmlContent}
            onChange={value => setHtmlContent(value)}
            setModalInsetFunc={(insetFunc, type) => {
              setModalType(type);
              setShowModal(true);
              setInsetQuillContentsFunc(insetFunc);
            }}
          />
        </>
      )}
      <ToggleWrapper>
        <MarkdownIcon />
        <Toggle
          size="small"
          isOn={contentType === "markdown"}
          onToggle={onMarkdownSwitch}
        />
      </ToggleWrapper>
    </div>
  );
};

export default UniverseEditor;
