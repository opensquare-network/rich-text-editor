import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import pkg from "./package.json";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [commonjs(), typescript({ tsconfig: "./tsconfig.json" }), json()],
    external: ["react", "react-dom", "styled-components"],
  },
  {
    input: "src/markdown.tsx",
    output: [
      {
        file: "dist/cjs/markdown.js",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/esm/markdown.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [commonjs(), typescript({ tsconfig: "./tsconfig.json" }), json()],
    external: ["react", "react-dom", "styled-components"],
  },
  {
    input: "dist/esm/types/src/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
  },
];
