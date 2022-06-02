import * as React from "react";
import ReactDOM from "react-dom";
import MarkdownEditor from "../src";
import { useState } from "react";
import "./styles/style.css";

export type DemoProps = {};

const markdown = `

`.trim();

const suggestions = [{
  preview: <span>abc</span>,
  value: "abc"
},
  {
    preview: <span>edf</span>,
    value: "edf"
  }];

export const Demo: React.FunctionComponent<DemoProps> = () => {
  const [content, setContent] = useState(markdown);
  return <div style={{maxWidth:800}}> <MarkdownEditor
    value={content}
    onChange={(value)=>{setContent(value)}}
    suggestions={suggestions}
    minHeight={150}
  />
  </div>
};

ReactDOM.render(<Demo />, document.getElementById("root"));

export default Demo;
