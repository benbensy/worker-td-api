import { defineConfig } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";
import nodeExternals from "rollup-plugin-node-externals";

export default defineConfig(() => {
  const commonPlugins = [
    nodeResolve(),
    commonjs(),
    json(),
    typescript(),
    nodeExternals(),
  ];

  /** @type {import('rollup').RollupOptions} */
  const module = {
    input: "src/index.ts",
    output: {
      dir: "dist",
      name: "[name].js",
      format: "es",
    },
    plugins: [...commonPlugins],
  };

  /** @type {import('rollup').RollupOptions} */
  const types = {
    input: "src/index.ts",
    output: {
      dir: "dist",
      name: "[name].js",
      format: "es",
    },
    plugins: [...commonPlugins, dts()],
  };

  return [module, types];
});
