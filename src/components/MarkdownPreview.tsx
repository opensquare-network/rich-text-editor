import { marked } from "marked";
import React from "react";
import sanitizeHtml from "sanitize-html";
import Prism from "prismjs";
import "github-markdown-css/github-markdown-light.css";
import "prismjs/themes/prism.css";
import { Box } from "@chakra-ui/layout";

type Props = {
  content?: string;
  allowedTags?: string[];
  bordered?: boolean;
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
    bordered = true,
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
    <Box
      borderLeft={4}
      borderStyle="solid"
      borderColor="#e2e8f0"
      pl="12px"
      minH="19.25px"
      {...restProps}
    >
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </Box>
  );
}
