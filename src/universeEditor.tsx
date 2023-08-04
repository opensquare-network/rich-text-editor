import * as React from "react";
import MarkdownEditor from "./markdown";
import { Suggestion } from "./types/suggestion";
import { ReactElement, useState } from "react";
import WYSIWYG from "../src/WYSIWYG";
import styled, { css } from "styled-components";
import Toggle from "../src/components/Toggle";
import MarkdownIcon from "../src/components/MarkdownIcon";
import InsertContentsModal from "./components/modal";
import { Plugin as PreviewerPlugin } from "@osn/previewer/dist/types";

interface WrapperProps {
  $active: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  --editor-radius: 8px;
  max-width: 800px;
  border: 1px solid var(--neutral400, #e0e4eb);
  border-radius: var(--editor-radius);
  overflow: hidden;

  &:hover {
    border-color: var(--neutral500, #c2c8d5);
  }

  ${(p) =>
    p.$active &&
    css`
      border-color: var(--neutral500, #c2c8d5);
    `}
`;

type Props = {
  value: string;
  onChange: (value: string) => void;
  contentType: "markdown" | "html";
  setContentType: (contentType: "markdown" | "html") => void;
  minHeight?: number;
  loadSuggestions?: (text: string) => Suggestion[];
  disabled?: boolean;
  identifier?: ReactElement;
  setQuillRef: any;
  previewerPlugins?: PreviewerPlugin[];
  toggleBarLeft?: React.ReactNode;
  onChangePreviewMode?: (isPreview: boolean) => void;
};

const ToggleBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
  border-top: 1px solid var(--neutral300, #ebeef4);
  background-color: var(--neutral100, #ffffff);
  height: 40px;
`;

const ToggleBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
`;

export const UniverseEditor: React.FunctionComponent<Props> = ({
  value,
  onChange,
  contentType = "markdown",
  setContentType,
  loadSuggestions,
  disabled = false,
  minHeight = 200,
  identifier,
  setQuillRef,
  previewerPlugins = [],
  toggleBarLeft,
  onChangePreviewMode = () => {},
}) => {
  const [active, setActive] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState("image");
  const [insetQuillContentsFunc, setInsetQuillContentsFunc] = useState(null);

  const onMarkdownSwitch = () => {
    if (
      value &&
      !confirm("Togging editor will empty all typed contents, are you sure ?")
    ) {
      return;
    }
    const newContentType = contentType === "html" ? "markdown" : "html";
    onChange("");
    setContentType(newContentType);
  };

  return (
    <Wrapper $active={active} className="editor-wrapper">
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
          previewerPlugins={previewerPlugins}
          onChangePreviewMode={onChangePreviewMode}
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
            setQuillRef={setQuillRef}
            previewerPlugins={previewerPlugins}
            onChangePreviewMode={onChangePreviewMode}
          />
        </>
      )}

      <ToggleBar className="toggle-bar-wrapper">
        {toggleBarLeft}
        <ToggleBarRight>
          <MarkdownIcon />
          <Toggle
            size="small"
            isOn={contentType === "markdown"}
            onToggle={onMarkdownSwitch}
          />
        </ToggleBarRight>
      </ToggleBar>
    </Wrapper>
  );
};

export default UniverseEditor;
