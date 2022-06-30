import * as React from "react";
import MarkdownEditor, { Suggestion } from "../src";
import { useState } from "react";
import WYSIWYG from "../src/WYSIWYG";
import styled from "styled-components";
import Toggle from "../src/components/Toggle";
import MarkdownIcon from "../src/components/MarkdownIcon";
import InsertContentsModal from "./components/modal";

export type DemoProps = {
  value: string;
  onChange: (value: string) => void;
  contentType: "markdown" | "html";
  setContentType: (contentType: "markdown" | "html") => void;
  minHeight?: number;
  loadSuggestions?: (text: string) => Suggestion[];
  disabled?: boolean;
};

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

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 8px;
  height: 40px;
  border-top: 1px solid #ebeef4;
  padding-right: 16px;
`;

export const UniverseEditor: React.FunctionComponent<DemoProps> = ({
  value,
  onChange,
  contentType = "markdown",
  setContentType,
  loadSuggestions,
  disabled = false,
  minHeight = 200
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("image");
  const [insetQuillContentsFunc, setInsetQuillContentsFunc] = useState(null);

  const onMarkdownSwitch = () => {
    if (
      value &&
      !confirm(`Togging editor will empty all typed contents, are you sure ?`)
    ) {
      return;
    }
    const newContentType = contentType === "html" ? "markdown" : "html";
    onChange("");
    setContentType(newContentType);
  };

  return (
    <div
      style={{
        maxWidth: 800,
        border: "1px solid #EBEEF4",
        borderRadius: 4
        // overflow: "hidden"
      }}
    >
      {contentType === "markdown" ? (
        <MarkdownEditor
          value={value}
          onChange={onChange}
          loadSuggestions={loadSuggestions}
          minHeight={minHeight}
          theme={"subsquare"}
          disabled={disabled}
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
            value={value}
            onChange={onChange}
            setModalInsetFunc={(insetFunc, type) => {
              setModalType(type);
              setShowModal(true);
              setInsetQuillContentsFunc(insetFunc);
            }}
            loadSuggestions={loadSuggestions}
            minHeight={minHeight}
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
