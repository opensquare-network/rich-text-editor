import React from "react";
import styled, { css } from "styled-components";

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Wrapper = styled(Flex)`
  display: flex;
  align-items: center;

  svg {
    margin-right: 4px;
  }
`;

const Display = styled.div`
  font-size: ${props => props.fontSize}px;
  font-weight: 500;
  ${p =>
    p.maxWidth
      ? css`
          max-width: ${p.maxWidth}px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        `
      : css`
          word-break: break-all;
        `}
`;

export default function Identity({ identity, fontSize = 14, maxWidth }) {
  if (!identity || identity?.info?.status === "NO_ID") {
    return null;
  }

  const displayName = identity?.info?.displayParent
    ? `${identity?.info?.displayParent}/${identity?.info?.display}`
    : identity?.info?.display;

  return (
    <Wrapper>
      {maxWidth ? (
        <Display fontSize={fontSize} maxWidth={maxWidth}>
          @{displayName}
        </Display>
      ) : (
        <Display fontSize={fontSize}>@{displayName}</Display>
      )}
    </Wrapper>
  );
}
