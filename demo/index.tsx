import * as React from "react";
import ReactDOM from "react-dom";
import MarkdownEditor from "../src";
import { useState } from "react";
import "./styles/style.css";
import styled from "styled-components";
import UniverseEditor from "../src/universeEditor";
import IdentityOrAddr from "../src/components/IdentityOrAddr";

export type DemoProps = {};

const markdown = `
Render identity or addr: [@displayName2](JFArxqV6rqPSwBok3zQDnj5jL6vwsZQDwYXXqb1cFygnYVt-kusama)
`.trim();

const suggestions = [
  {
    preview: <span>abc</span>,
    value: "[@abd](abc-polkadot) ",
    address: "abc-polkadot"
  },
  {
    preview: <span>def1</span>,
    value: "[@def1](def-kusama) ",
    address: "abc-polkadot"
  },
  {
    preview: <span>def2</span>,
    value: "[@def2](def-kusama) ",
    address: "abc-polkadot"
  },
  {
    preview: <span>def3</span>,
    value: "[@def3](def-kusama) ",
    address: "abc-polkadot"
  },
  {
    preview: <span>def4</span>,
    value: "[@def4](def-kusama) ",
    address: "abc-polkadot"
  },
  {
    preview: <span>def5</span>,
    value: "[@def5](def-kusama) ",
    address: "abc-polkadot"
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
  const [content, setContent] = useState(markdown);
  const [contentType, setContentType] = useState("markdown");

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
        identifier={<IdentityOrAddr />}
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
