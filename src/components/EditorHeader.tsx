import * as React from "react";
import {
  Tab,
  TabsWrapper,
  ToolBar,
  ToolbarButton,
  ToolbarItemsWrapper,
} from "./EditorComponents";
import Bold from "../icons/bold";
import Underline from "../icons/underline";
import Delete from "../icons/delete";
import Ul from "../icons/ul";
import Ol from "../icons/ol";
import Link from "../icons/link";
import Img from "../icons/img";
import Code from "../icons/code";
import { ThemeCss } from "../types";

type Props = {
  theme: ThemeCss;
  isPreview: boolean;
  setIsPreview: React.Dispatch<React.SetStateAction<boolean>>;
  commandController: any;
};

export default function EditorHeader({
  theme,
  isPreview,
  setIsPreview,
  commandController,
}: Props) {
  return (
    <ToolBar className="editor-toolbar" theme={theme} $isPreview={isPreview}>
      <TabsWrapper theme={theme}>
        <Tab
          $active={!isPreview}
          onClick={() => setIsPreview(false)}
          theme={theme}
          style={{ borderTopLeftRadius: 3 }}
          className={!isPreview ? "active" : ""}
        >
          Write
        </Tab>
        <Tab
          $active={isPreview}
          onClick={() => setIsPreview(true)}
          theme={theme}
          className={isPreview ? "active" : ""}
        >
          Preview
        </Tab>
      </TabsWrapper>
      <ToolbarItemsWrapper $hide={isPreview}>
        <ToolbarButton
          onClick={async () => {
            await commandController.executeCommand("bold");
          }}
        >
          <Bold />
        </ToolbarButton>
        <ToolbarButton
          onClick={async () => {
            await commandController.executeCommand("underline");
          }}
        >
          <Underline />
        </ToolbarButton>
        <ToolbarButton
          onClick={async () => {
            await commandController.executeCommand("delete");
          }}
        >
          <Delete />
        </ToolbarButton>
        <ToolbarButton
          onClick={async () => {
            await commandController.executeCommand("ul");
          }}
        >
          <Ul />
        </ToolbarButton>
        <ToolbarButton
          onClick={async () => {
            await commandController.executeCommand("ol");
          }}
        >
          <Ol />
        </ToolbarButton>
        <ToolbarButton
          onClick={async () => {
            await commandController.executeCommand("link");
          }}
        >
          <Link />
        </ToolbarButton>
        <ToolbarButton
          onClick={async () => {
            await commandController.executeCommand("image");
          }}
        >
          <Img />
        </ToolbarButton>
        <ToolbarButton
          onClick={async () => {
            await commandController.executeCommand("code");
          }}
        >
          <Code />
        </ToolbarButton>
      </ToolbarItemsWrapper>
    </ToolBar>
  );
}
