import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  entry: ["src/index.ts", "src/markdown.tsx"],
  format: ["cjs", "esm"],
  legacyOutput: true,
  sourcemap: true,
  external: ["react", "react-dom", "styled-components"],
});
