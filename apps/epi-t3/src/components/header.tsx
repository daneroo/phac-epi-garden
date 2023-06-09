import { type FC } from "react";
import Image from "next/image";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { DarkThemeToggle, Navbar } from "flowbite-react";

import { useSidebarContext } from "../context/sidebar";

export const Header: FC<Record<string, never>> = function () {
  const { isOpenOnSmallScreens, isPageWithSidebar, setOpenOnSmallScreens } =
    useSidebarContext();

  return (
    <header className="sticky top-0 z-20">
      {/* border-none */}
      <div className="mx-auto max-w-3xl md:max-w-5xl">
        <Navbar fluid className="border-b border-t-0 border-gray-900/10">
          {isPageWithSidebar && (
            <button
              aria-controls="sidebar"
              aria-expanded="true"
              className="mr-2 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700 lg:hidden"
              onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
            >
              {isOpenOnSmallScreens ? (
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </button>
          )}
          <Navbar.Brand href="/">
            <Image
              alt="Flowbite logo"
              height="24"
              src="/images/epi-logo.svg"
              width="32"
            />
            <span className="self-center whitespace-nowrap px-3 text-xl font-semibold dark:text-gray-100">
              epicenter
            </span>
          </Navbar.Brand>
          <div className="flex md:order-2">
            <Navbar.Toggle />
            <DarkThemeToggle />
          </div>
          <Navbar.Collapse>
            {/* Links can be "Active" */}
            {/* <Navbar.Link href="/" active>Home</Navbar.Link> */}
            <Navbar.Link href="/search">Skill Search</Navbar.Link>
            <Navbar.Link
              href="https://epi-docs.dl.phac.alpha.canada.ca/"
              target="_blank"
            >
              <span className="flex items-center gap-1 stroke-current">
                <span>Documentation</span>
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </span>
            </Navbar.Link>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </header>
  );
};
