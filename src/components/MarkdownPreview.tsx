import styled from "@emotion/styled";
import { marked } from "marked";
import React from "react";
import sanitizeHtml from "sanitize-html";
import Prism from "prismjs";
import "github-markdown-css";
import "prismjs/themes/prism.css";

const MarkdownContent = styled.div``;

type Props = {
  content?: string;
  allowedTags?: string[];
  style?: React.CSSProperties;
};

function MarkdownPreview(props: Props = {}) {
  const {
    content = "",
    allowedTags = sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "iframe",
      "br",
      "ins",
      "del",
    ]),
    ...restProps
  } = props;

  const html = marked.parse(content, {
    breaks: true,
    highlight(code, lang) {
      if (!lang) {
        return code;
      }

      const language = Prism.languages[lang] ?? Prism.languages.markup;
      return Prism.highlight(code, language, lang);
    }
  });

  const cleanHtml = sanitizeHtml(html, {
    allowedTags,
    allowedAttributes: {
      img: ["src", "size", "width", "height"],
      iframe: ["src", "width", "height"],
      a: ["href", "rel", "target"],
      "*": ["class"],
      td: ["align"],
      th: ["align"]
    }
  });

  return (
    <MarkdownContent {...restProps} className="markdown-preview">
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </MarkdownContent>
  );
}

export default MarkdownPreview;
