import styled from "styled-components";

const StateToggle = styled.div`
  position: absolute;
  display: flex;

  button {
    border: 0;
    background-color: transparent;
    padding: 12px 16px;
    /* padding-bottom: 13px; */
    font-size: 14px;
    line-height: 1rem;
    font-weight: 500;
    cursor: pointer;
    color: var(--textSecondary, #506176);
  }

  button.active {
    background-color: var(--neutral100, #ffffff);
    box-shadow: 0 1px 0 0 var(--neutral100, #ffffff);
    color: var(--textPrimary, #1e2134);
    :first-child {
      box-shadow: 1px 0 0 0 var(--neutral300, #ebeef4);
    }
    :last-child {
      box-shadow: -1px 0 0 0 var(--neutral300, #ebeef4),
        1px 0 0 0 var(--neutral300, #ebeef4);
    }
    :hover {
      color: var(--textPrimary, #1e2134);
    }
  }

  @media screen and (max-width: 769px) {
    position: initial;
    button {
      flex-basis: 50%;
      text-align: center;
      background-color: var(--neutral200, #f6f7fa);
    }
  }
`;

export default StateToggle;
