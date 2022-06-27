import styled from "styled-components";

const StateToggle = styled.div`
  position: absolute;
  display: flex;

  button {
    all: unset;
    padding: 12px;
    padding-bottom: 13px;
    font-size: 14px;
    line-height: 14px;
    font-weight: 500;
    cursor: pointer;
    //border-radius: 4px;
    color: #9DA9BB;
    //border: 1px solid #E0E4EB;
    border-top: none;
  }

  button.active {
    background-color: #ffffff;
    box-shadow: 0 1px 0 0 white;
    color: #1E2134;
    :hover {
      color: #1E2134;
    }
  }

  button:hover {
    color: #506176;
  }
`;

export default StateToggle;
