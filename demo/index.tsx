import * as React from "react";
import ReactDOM from "react-dom";
import MarkdownEditor from "../src";
import { useEffect, useState } from "react";
import "./styles/style.css";
import WYSIWYG from "../src/WYSIWYG";
import styled from "styled-components";
import Toggle from "../src/components/Toggle";
import MarkdownIcon from "../src/components/MarkdownIcon";
import UniverseEditor from "../src/universeEditor";

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
    value: "[@abd](abc-polkadot) "
  },
  {
    preview: <span>def1</span>,
    value: "[@def1](def-kusama) "
  },
  {
    preview: <span>def2</span>,
    value: "[@def2](def-kusama) "
  },
  {
    preview: <span>def3</span>,
    value: "[@def3](def-kusama) "
  },
  {
    preview: <span>def4</span>,
    value: "[@def4](def-kusama) "
  },
  {
    preview: <span>def5</span>,
    value: "[@def5](def-kusama) "
  }
];

const html = `<p><a href="https://www.baidu.com/">https://www.baidu.com/</a></p><h1>heading 1</h1><p><strong>bold text</strong><em>italic text</em><code>inline code</code></p><ul><li>bullet 1</li></ul><ol><li>numbered 1</li></ol><pre><code class="language-bash">echo "hello"</code></pre><blockquote><p>quote text</p></blockquote>`;

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 8px;
  height: 40px;
  border: 1px solid #ebeef4;
  border-top: none;
  padding-right: 16px;
  border-radius: 4px;
`;

export const Demo: React.FunctionComponent<DemoProps> = () => {
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

  const loadSuggestions = (text: string) => {
    return suggestions.filter(i =>
      i.value.toLowerCase().includes(text.toLowerCase())
    );
  };
  return (
    <div style={{ paddingTop: 1000, maxWidth: 800, margin: 150 }}>
      <MarkdownEditor
        value={content}
        onChange={value => {
          setContent(value);
        }}
        loadSuggestions={loadSuggestions}
        minHeight={150}
      />
      <br />
      <UniverseEditor />
    </div>
  );
};

ReactDOM.render(<Demo />, document.getElementById("root"));

export default Demo;
