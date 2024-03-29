import * as React from "react";
import { createRoot } from "react-dom/client";
import MarkdownEditor from "../src";
import { useState } from "react";
import "./styles/style.css";
import styled from "styled-components";
import UniverseEditor from "../src/universeEditor";

const isBase58 = (value: string): boolean =>
  /^[A-HJ-NP-Za-km-z1-9]*$/.test(value);

const isAddress = (address: string): boolean => {
  return [46, 47, 48].includes(address.length) && isBase58(address);
};

const markdown = `
Render identity or addr: [@displayName2](JFArxqV6rqPSwBok3zQDnj5jL6vwsZQDwYXXqb1cFygnYVt-kusama)
`.trim();

const suggestions = [
  {
    preview: "yoshiyuki123",
    value:
      "[@yoshiyuki123](/member/pqd2VaK94rRYCrFCcFpZa7thm4E74BoBb6RcHZUo1eQuBak) ",
    address: "pqd2VaK94rRYCrFCcFpZa7thm4E74BoBb6RcHZUo1eQuBak",
    isKeyRegistered: false,
    chain: "karura",
  },
  {
    preview: "OpenSquare",
    value:
      "[@Open...uare](qAeY4WkoFMYGReUrt6e4N35NrS6DAm1eGBSm8KLnPy8hdbZ-karura)",
    address: "qAeY4WkoFMYGReUrt6e4N35NrS6DAm1eGBSm8KLnPy8hdbZ",
    isKeyRegistered: true,
    chain: "karura",
  },
  {
    preview: "yoshiyuki456",
    value: "[@yoshiyuki456](/member/yoshiyuki456) ",
    address: "yoshiyuki456",
    isKeyRegistered: false,
    chain: "karura",
  },
];

const html =
  "<p><a href=\"https://www.baidu.com/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(31, 112, 199);\">https://www.baidu.com/</a></p><h1><span style=\"color: rgb(30, 33, 52);\">heading 1</span></h1><h2><span style=\"color: rgb(30, 33, 52);\">heading 2</span></h2><p><strong style=\"color: rgb(30, 33, 52);\">bold text</strong></p><p><em style=\"color: rgb(30, 33, 52);\">italic text</em></p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"color: rgb(30, 33, 52);\">bullet 1</span></li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"color: rgb(30, 33, 52);\">bullet 2</span></li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"color: rgb(30, 33, 52);\">numbered 1</span></li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"color: rgb(30, 33, 52);\">numbered 2</span></li></ol><table><tbody><tr><td data-row=\"1\"><strong style=\"color: rgb(30, 33, 52); background-color: rgb(240, 243, 248);\">tableexampleindex</strong></td></tr><tr><td data-row=\"2\"><span style=\"color: rgb(30, 33, 52);\">table</span></td><td data-row=\"2\"><span style=\"color: rgb(30, 33, 52);\">column</span></td><td data-row=\"2\"><span style=\"color: rgb(30, 33, 52);\">1</span></td></tr><tr><td data-row=\"3\"><span style=\"color: rgb(30, 33, 52);\">table</span></td><td data-row=\"3\"><span style=\"color: rgb(30, 33, 52);\">column</span></td><td data-row=\"3\"><span style=\"color: rgb(30, 33, 52);\">2</span></td></tr></tbody></table><div class=\"ql-code-block-container\" spellcheck=\"false\"><pre class=\"ql-code-block\" data-language=\"plain\">echo \"hello\"</pre></div><p><code style=\"color: rgb(30, 33, 52); background-color: rgb(240, 243, 248);\">inline code</code></p><blockquote><span style=\"color: rgb(30, 33, 52);\">quote text</span></blockquote><h1><br></h1>";

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

export const Demo: React.FunctionComponent = () => {
  const [content, setContent] = useState(
    `[@yoshiyuki123](/member/pqd2VaK94rRYCrFCcFpZa7thm4E74BoBb6RcHZUo1eQuBak) 
[@yoshiyuki456](/member/yoshiyuki456) `,
  );
  const [contentType, setContentType] = useState("markdown");

  const loadSuggestions = (text: string) => {
    return suggestions.filter((i) =>
      i.value.toLowerCase().includes(text.toLowerCase()),
    );
  };

  return (
    <div style={{ maxWidth: 800 }}>
      {content}
      <button onClick={() => setContent("")}>reset</button>
      <UniverseEditor
        value={content}
        onChange={(value) => {
          setContent(value);
        }}
        contentType={contentType}
        setContentType={setContentType}
        loadSuggestions={loadSuggestions}
        minHeight={100}
        identifier={<h1>ID</h1>}
        setQuillRef={() => {}}
        previewerPlugins={[
          {
            name: "disable-non-address-link",
            onRenderedHtml(el) {
              const targets = el?.querySelectorAll?.("a");
              targets?.forEach((target) => {
                const [, memberId] =
                  target.getAttribute("href")?.match(/^\/member\/([-\w]+)$/) ||
                  [];
                if (memberId && !isAddress(memberId)) {
                  target.classList.add("disabled-link");
                } else {
                  target.setAttribute("target", "_blank");
                }
              });
            },
          },
        ]}
      />
      <br />
      <MarkdownEditor
        value={content}
        onChange={(value) => {
          setContent(value);
        }}
        loadSuggestions={loadSuggestions}
        minHeight={150}
      />
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<Demo />);

export default Demo;
