import React, { useMemo } from "react";
import { CommandController } from "../commands/command-controller";
import { TextAreaTextController } from "../text/textarea-text-controller";
import { TextController } from "../types/CommandOptions";
import { CommandMap } from "../commands/command";

export type UseTextAreaMarkdownEditorResult<CommandName extends string> = {
  textController: TextController;
  commandController: CommandController<CommandName>;
};

export type UseTextAreaMarkdownEditorOptions<CommandName extends string> = {
  commandMap: CommandMap<CommandName>;
};

export function useTextAreaMarkdownEditor<CommandName extends string>(
  ref: React.RefObject<HTMLTextAreaElement>,
  options: UseTextAreaMarkdownEditorOptions<CommandName>,
): UseTextAreaMarkdownEditorResult<CommandName> {
  const textController = useMemo(() => {
    return new TextAreaTextController(ref);
  }, [ref]);

  const commandController = useMemo(
    () => new CommandController(textController, options.commandMap),
    [ref],
  );

  return {
    textController,
    commandController,
  };
}
