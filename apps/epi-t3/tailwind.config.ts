import type { Config } from "tailwindcss";

import baseConfig from "@phac/tailwind-config";

export default {
  content: [
    "./src/**/*.tsx",
    // normally they would be here
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-react/**/*.js",
    // but we are in a pnpm workspace
    "../../node_modules/flowbite/**/*.js",
    "../../node_modules/flowbite-react/**/*.js",
  ],
  presets: [baseConfig],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
} satisfies Config;
