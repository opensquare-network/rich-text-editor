import * as React from "react";
import MarkdownEditor from "../src";
import { useState } from "react";
import WYSIWYG from "../src/WYSIWYG";
import styled from "styled-components";
import Toggle from "../src/components/Toggle";
import MarkdownIcon from "../src/components/MarkdownIcon";

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

const suggestions = [{
  preview: <span>abc</span>,
  value: "abc"
},
  {
    preview: <span>edf</span>,
    value: "edf"
  }];

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 8px;
  height: 40px;
  border: 1px solid #EBEEF4;
  border-top: none;
  padding-right: 16px;
  border-radius: 4px;
`;

export const UniverseEditor: React.FunctionComponent<DemoProps> = () => {
  const [content, setContent] = useState(markdown);
  const [contentType, setContentType] = useState("markdown");
  const [htmlContent, setHtmlContent] = useState(`<p>　</p>`);

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

  return <div style={{ maxWidth: 800 }}>
    {
      contentType === "markdown" ?
        <MarkdownEditor
          value={content}
          onChange={(value) => {
            setContent(value);
          }}
          suggestions={suggestions}
          minHeight={200}
          theme={"subsquare"}
        />
        :
        <WYSIWYG value={htmlContent} onChange={value => setHtmlContent(value)} />
    }
    <ToggleWrapper>
      <MarkdownIcon/>
      <Toggle size="small"
              isOn={contentType === "markdown"}
              onToggle={onMarkdownSwitch} />
    </ToggleWrapper>
  </div>;
};

export default UniverseEditor;
