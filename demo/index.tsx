import * as React from "react";
import ReactDOM from "react-dom";
import MarkdownEditor from "../src";
import { useState } from "react";
import "./styles/style.css";
import styled from "styled-components";
import UniverseEditor from "../src/universeEditor";

export type DemoProps = {};

const markdown = `
Render identity or addr: [@displayName2](JFArxqV6rqPSwBok3zQDnj5jL6vwsZQDwYXXqb1cFygnYVt-kusama)
`.trim();

const suggestions = [
  {
    "preview": "yoshiyuki123",
    "value": "[@yoshiyuki123](/member/pqd2VaK94rRYCrFCcFpZa7thm4E74BoBb6RcHZUo1eQuBak) ",
    "address": "pqd2VaK94rRYCrFCcFpZa7thm4E74BoBb6RcHZUo1eQuBak",
    isKeyRegistered: false,
    chain:"karura",
  },
  {
    "preview": "OpenSquare",
    "value": "[@Open...uare](qAeY4WkoFMYGReUrt6e4N35NrS6DAm1eGBSm8KLnPy8hdbZ-karura)",
    "address": "qAeY4WkoFMYGReUrt6e4N35NrS6DAm1eGBSm8KLnPy8hdbZ",
    isKeyRegistered: true,
    chain:"karura",
  },
  {
    "preview": "yoshiyuki456",
    "value": "[@yoshiyuki456](/member/yoshiyuki456) ",
    "address": "yoshiyuki456",
    isKeyRegistered: false,
    chain:"karura",
  }
];

const html = `
<a href="osn-address/JFArxqV6rqPSwBok3zQDnj5jL6vwsZQDwYXXqb1cFygnYVt/kusama" osn-polka-address="Ff3u3eNGBjHyHqvPd3qEeZg51UqJa6AFJRRqJTTj29sp4ST" osn-polka-network="karura">
    @JFArx...gnYVt
  </a>
`;

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
  const [content, setContent] = useState(``);
  const [contentType, setContentType] = useState("html");

  const loadSuggestions = (text: string) => {
    return suggestions.filter(i =>
      i.value.toLowerCase().includes(text.toLowerCase())
    );
  };

  return (
    <div style={{ paddingTop: 100, maxWidth: 800, margin: 150 }}>
      {content}
      <UniverseEditor
        value={content}
        onChange={value => {
          setContent(value);
        }}
        contentType={contentType}
        setContentType={setContentType}
        loadSuggestions={loadSuggestions}
        minHeight={200}
        identifier={<h1>ID</h1>}
      />
      <br />
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
