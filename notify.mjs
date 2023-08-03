import { execSync } from "node:child_process";
import axios from "redaxios";
import process from "node:process";
import pkg from "./package.json" assert { type: "json" };
import console from "node:console";

const url = process.env.WEBHOOK_URL;

main();

function main() {
  if (!url) {
    return;
  }

  const msg = getLatestGitMsg();

  // quick filter semantic release commit trigger condition
  if (
    msg.startsWith("feat: ") ||
    msg.startsWith("fix: ") ||
    msg.includes("BREAKING CHANGE: ")
  ) {
    const data = {
      msg_type: "text",
      content: {
        text: `${pkg.name}@${pkg.version}\n\n${msg}`,
      },
    };
    axios.post(url, data);
  } else {
    console.info("No need to notify");
  }
}

function getLatestGitMsg() {
  let msg = "";

  try {
    msg = execSync("git log -1 --pretty=format:%s").toString().trim();
  } catch (error) {
    console.error(error);
  }

  return msg;
}
