import * as React from "react";
import ReactDOM from "react-dom";
import MarkdownEditor from "../src";

export type DemoProps = {};

export const Demo: React.FunctionComponent<DemoProps> = () => {
  return <MarkdownEditor />;
};

ReactDOM.render(<Demo />, document.getElementById("root"));

export default Demo;
