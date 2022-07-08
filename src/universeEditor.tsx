import * as React from "react";
import MarkdownEditor from "./markdown";
import { Suggestion } from "./interfaces";
import { ReactElement, useState } from "react";
import WYSIWYG from "../src/WYSIWYG";
import styled, {css} from "styled-components";
import Toggle from "../src/components/Toggle";
import MarkdownIcon from "../src/components/MarkdownIcon";
import InsertContentsModal from "./components/modal";

interface WrapperProps {
  active: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  max-width: 800px;
  border: 1px solid #e0e4eb;
  border-radius: 4px;
  &:hover{
    border-color: #C2C8D5;
  }
  ${p =>
          p.active &&
          css`
            border-color: #C2C8D5;
    `}
`

export type DemoProps = {
  value: string;
  onChange: (value: string) => void;
  contentType: "markdown" | "html";
  setContentType: (contentType: "markdown" | "html") => void;
  minHeight?: number;
  loadSuggestions?: (text: string) => Suggestion[];
  disabled?: boolean;
  identifier?: ReactElement;
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
  minHeight = 200,
  identifier
}) => {
  const [active, setActive] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
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
    <Wrapper active={active}>
      {contentType === "markdown" ? (
        <MarkdownEditor
          value={value}
          onChange={onChange}
          loadSuggestions={loadSuggestions}
          minHeight={minHeight}
          theme={"subsquare"}
          disabled={disabled}
          identifier={identifier}
          setActive={setActive}
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
            identifier={identifier}
            setActive={setActive}
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
    </Wrapper>
  );
};

export default UniverseEditor;
