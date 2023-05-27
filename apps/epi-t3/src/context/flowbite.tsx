"use client";

import { Flowbite } from "flowbite-react";
import { type FC, type PropsWithChildren } from "react";
// import { type CustomFlowbiteTheme } from "flowbite-react/lib/esm/components/Flowbite/FlowbiteTheme";

const FlowbiteContext: FC<PropsWithChildren> = function ({ children }) {
  return <Flowbite>{children}</Flowbite>;
  // return <Flowbite theme={{ theme: flowbiteTheme }}>{children}</Flowbite>;
};

export default FlowbiteContext;

// Not really using this the functionality
// const flowbiteTheme: CustomFlowbiteTheme = {
//   footer: {
//     base: "flex flex-col", // this is broken for types
//     brand: {
//       base: "m-6 flex items-center",
//     },
//     groupLink: {
//       base: "flex flex-col flex-wrap text-slate-500 dark:text-white",
//       link: {
//         base: "mb-4 last:mr-0 md:mr-6",
//       },
//     },
//     icon: {
//       base: "text-slate-400 hover:text-slate-900 dark:hover:text-white",
//     },
//   },
//   modal: {
//     body: {
//       base: "space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8",
//     },
//   },
//   sidebar: {
//     base: "h-full bg-slate-50",
//     collapse: {
//       list: "space-y-2 py-2 list-none",
//     },
//     inner:
//       "h-full overflow-y-auto overflow-x-hidden bg-white py-4 px-3 dark:bg-slate-800",
//     item: {
//       base: "no-underline flex items-center rounded-lg p-2 text-lg font-normal text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700",
//     },
//     itemGroup:
//       "list-none border-t border-slate-200 pt-3 first:mt-0 first:border-t-0 first:pt-0 dark:border-slate-700",
//   },
// };
