import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { capNames, capNamesDistributionObject } from "~/components/taxonomy";

const CapabilityPage: NextPage = () => {
  const [search, setSearch] = useState("");
  const onSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(evt.target.value);
  };

  // Filter the capability names based on the search term
  const filteredCapabilities = capNames.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Capabilities - Epicenter</title>
        <meta name="description" content="Capabilities - Epicenter" />
      </Head>
      <main className="max-w-3xl mx-auto px-4 pb-4 md:max-w-5xl">
        <h2 className="text-2xl font-extrabold my-4">Capabilities</h2>

        <form className="flex items-center mb-4 max-w-lg">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              onChange={onSearchChange}
              type="text"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search"
              required
            />
          </div>
        </form>

        {filteredCapabilities.length === 0 ? (
          <span>No capabilities found!</span>
        ) : (
          <div className="relative overflow-x-auto">
            <div className="flex flex-wrap gap-2">
              {filteredCapabilities.map((name, i) => (
                <span
                  key={i}
                  className="flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full gap-1"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>{name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {capNamesDistributionObject[name]}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default CapabilityPage;