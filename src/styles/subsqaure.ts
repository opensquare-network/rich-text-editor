import { css } from "styled-components";

const SubSquare = {
  wrapper: css`
    border: none;
    .mention-list {
      font-size: 14px;
      line-height: 20px;
      li {
        padding: 12px 10px;
        font-weight: 500;
      }
    }
  `,
  toolbar: css`
    justify-content: end;
    background-color: var(--neutral200, #f6f7fa);
    padding-left: 0;
    padding-right: 16px;
    height: 39px;
    border-bottom: 1px solid var(--neutral300, #ebeef4);
    position: relative;
    > div:first-child {
      gap: 0;
      height: 39px;
    }
    @media screen and (max-width: 769px) {
      padding-top: 40px;
      padding-left: 16px;
    }
  `,
  tabs: css`
    position: absolute;
    left: 0;
    top: 0;
  `,
  tab: css`
    padding: 12px 16px;
    line-height: 1rem;
    margin-right: 1px;
    /* border-bottom: none; */
    color: var(--textSecondary, #506176);

    :last-child {
      box-shadow: 1px 0 0 0 var(--neutral300, #ebeef4);
    }

    :hover {
      color: var(--textSecondary, #506176);
    }
  `,
  tabActive: css`
    background-color: var(--neutral100, #ffffff);
    color: var(--textPrimary, #1e2134);
    border-bottom-color: var(--neutral100, #ffffff);
    :first-child {
      box-shadow: 0 1px 0 0 var(--neutral100, #ffffff),
        1px 0 0 0 var(--neutral300, #ebeef4);
    }
    :last-child {
      margin-right: 0;
      box-shadow: 0 1px 0 0 var(--neutral100, #ffffff),
        1px 0 0 0 var(--neutral300, #ebeef4),
        -1px 0 0 0 var(--neutral300, #ebeef4);
    }
    :hover {
      color: var(--textPrimary, #1e2134);
    }
  `,
  tabMobile: css`
    margin-left: 0;
    margin-right: 0;
  `,
  textarea: css`
    background-color: var(--neutral100, #ffffff);
    border-bottom: none;
  `,
  preview: css``,
};

export default SubSquare;
