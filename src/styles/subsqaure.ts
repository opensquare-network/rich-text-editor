import { css } from "styled-components";

const SubSquare = {
  wrapper: css`
    border: none;
    .mention-list {
      font-size: 14px;
      line-height: 20px;
      li {
        padding: 10px 12px;
      }
    }
  `,
  toolbar: css`
    justify-content: end;
    background-color: #f6f7fa;
    padding-left: 0;
    padding-right: 20px;
    height: 40px;
    border-bottom: 1px solid #e0e4eb;
    position: relative;
    > div:first-child {
      gap: 0;
      height: 40px;
    }
  `,
  tabs: css`
    position: absolute;
    left: 0;
  `,
  tab: css`
    padding: 12px;
    line-height: 16px;
    border-bottom: none;
    color: #9da9bb;

    :last-child {
      box-shadow: 1px 0 0 0 #e0e4eb;
    }

    :hover {
      color: #506176;
    }
  `,
  tabActive: css`
    background-color: white;
    color: #1e2134;
    border-bottom: 17px solid white;
    :first-child {
      box-shadow: 1px 0 0 0 #e0e4eb;
    }
    :last-child {
      box-shadow: -1px 0 0 0 #e0e4eb, 1px 0 0 0 #e0e4eb;
    }
    :hover {
      color: #1e2134;
    }
  `,
  textarea: css`
    background-color: white;
    border-bottom: none;
  `,
  preview: css`
    background-color: white;
  `
};

export default SubSquare;
