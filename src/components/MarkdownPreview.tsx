import { marked } from "marked";
import React from "react";
import sanitizeHtml from "sanitize-html";
import Prism from "prismjs";
import "github-markdown-css/github-markdown-light.css";
import "prismjs/themes/prism.css";
import styles from "../styles/markdown-preview.module.css";

type Props = {
  content?: string;
  allowedTags?: string[];
  style?: React.CSSProperties;
};

export function MarkdownPreview(props: Props = {}) {
  const {
    content = "",
    allowedTags = sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "iframe",
      "br",
      "ins",
      "del"
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
    <div className={styles.markdownPreview} {...restProps}>
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </div>
  );
}
