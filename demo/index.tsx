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

export const Demo: React.FunctionComponent<DemoProps> = () => {
  const [content, setContent] = useState(markdown);

  const loadSuggestions = (text: string) => {
    return suggestions.filter(i =>
      i.value.toLowerCase().includes(text.toLowerCase())
    );
  };
  return (
    <div style={{ paddingTop: 30, maxWidth: 800, margin: 20 }}>
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
