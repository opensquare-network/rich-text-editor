import * as React from "react";
import styles from '../src/styles/editor.module.scss';

export type ToolbarButtonProps = {
  onClick: () => void;
};

export const ToolbarButton: React.FC<ToolbarButtonProps> = props => {
  return (
    <button
      className={styles.toolbarItem}
      color={"gray.600"}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
