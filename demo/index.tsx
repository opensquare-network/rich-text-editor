import * as React from "react";
import ReactDOM from "react-dom";
import MarkdownEditor from "../src";
import { useState } from "react";
import "./styles/style.css";

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

export const Demo: React.FunctionComponent<DemoProps> = () => {
  const [content, setContent] = useState(markdown);

  const loadSuggestions = (text: string) => {
    return suggestions.filter(i =>
      i.value.toLowerCase().includes(text.toLowerCase())
    );
  };
  return (
    <div style={{ maxWidth: 800 }}>
      <MarkdownEditor
        value={content}
        onChange={value => {
          setContent(value);
        }}
        loadSuggestions={loadSuggestions}
        minHeight={150}
      />
    </div>
  );
};

ReactDOM.render(<Demo />, document.getElementById("root"));

export default Demo;
