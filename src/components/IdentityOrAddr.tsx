import React, { memo, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { fetchIdentity } from "../services/fetchIdentity";
import { encodeAddressToChain } from "../services/encode";
import { nodes } from "../services/consts";
import Identity from "./Identity";

function textEllipsis(text, start, end) {
  if (!text) return;
  if (text.length <= start + end) return text;
  if (!text.slice) return text;
  return `${text.slice(0, start)}...${text.slice(-end)}`;
}

function addressEllipsis(address, start = 4, end = 4) {
  return textEllipsis(address, start, end);
}

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Wrapper = styled(Flex)`
  a {
    &:hover {
      text-decoration: underline;
    }
  }
  ${p =>
    p.noEvent &&
    css`
      pointer-events: none;
    `}
`;

const AvatarWrapper = styled(Flex)`
  display: flex;
  margin-right: 8px;
`;

const Username = styled.div`
  font-weight: 500;
  font-size: ${props => props.fontSize}px;
  ${p =>
    p.color
      ? css`
          color: ${p.color} !important;
        `
      : css``}
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

const DeleteAccount = styled(Flex)`
  font-weight: 500;
  word-break: break-all;
  font-size: ${props => props.fontSize}px;
  color: #9da9bb;
  > img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
`;

const LinkWrapper = styled.a`
  ${p =>
    p.color
      ? css`
          color: ${p.color} !important;
          text-decoration-color: ${p.color} !important;
        `
      : css``}
  display: block;
  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

function IdentityOrAddr({
  network,
  address,
  fontSize = 14,
  noEvent = false,
  maxWidth,
  color
}) {
  const [identity, setIdentity] = useState(null);
  useEffect(() => {
    setIdentity(null);
    if (address) {
      const identity = nodes.find(n => n.value === network)?.identity;
      console.log(identity, 123);
      if (!identity) return;

      fetchIdentity(
        identity,
        encodeAddressToChain(address, identity)
      ).then(identity => setIdentity(identity));
    }
  }, [address, network]);

  if (!address) {
    return (
      <DeleteAccount fontSize={fontSize}>
        <img src="/imgs/icons/avatar-deleted.svg" alt="" />
        [Deleted Account]
      </DeleteAccount>
    );
  }

  const addressWithoutIdentity = maxWidth ? (
    <div>
      <Username fontSize={fontSize} maxWidth={maxWidth} color={color}>
        {addressEllipsis(address)}
      </Username>
    </div>
  ) : (
    <Username fontSize={fontSize} color={color}>
      {addressEllipsis(address)}
    </Username>
  );

  return (
    <Wrapper noEvent={noEvent}>
      {
        <LinkWrapper
          color={color}
          href={`https://${network}.subscan.io/account/${address}`}
          target="_blank"
        >
          {identity && identity?.info?.status !== "NO_ID" ? (
            <Identity
              identity={identity}
              fontSize={fontSize}
              maxWidth={maxWidth}
            />
          ) : (
            addressWithoutIdentity
          )}
        </LinkWrapper>
      }
    </Wrapper>
  );
}

export default memo(IdentityOrAddr);
