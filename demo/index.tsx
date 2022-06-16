import * as React from "react";
import ReactDOM from "react-dom";
import MarkdownEditor from "../src";
import { useState } from "react";
import "./styles/style.css";
import WYSIWYG from "../src/WYSIWYG";

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

const html = `<p><a href="https://www.baidu.com/">https://www.baidu.com/</a></p><h1>heading 1</h1><p><strong>bold text</strong><em>italic text</em><code>inline code</code></p><ul><li>bullet 1</li></ul><ol><li>numbered 1</li></ol><pre><code class="language-bash">echo "hello"</code></pre><blockquote><p>quote text</p></blockquote>`;

export const Demo: React.FunctionComponent<DemoProps> = () => {
  const [content, setContent] = useState(markdown);
  const [htmlContent, setHtmlContent] = useState("");
  return <div style={{maxWidth:800}}>
    <br/>
    <div>
      {htmlContent}
    </div>
    <WYSIWYG value={htmlContent} onChange={value => setHtmlContent(value)} />
    <br/>
    <MarkdownEditor
      value={content}
      onChange={(value)=>{setContent(value)}}
      suggestions={suggestions}
      minHeight={150}
    />
  </div>
};

ReactDOM.render(<Demo />, document.getElementById("root"));

export default Demo;
