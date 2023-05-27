import { useState, useEffect } from "react"
import type { NextPage } from "next";
import Head from "next/head";
import Link from 'next/link'

import { api } from "~/utils/api";

function useDebounce(value: string, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler: NodeJS.Timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const PersonsPage: NextPage = () => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  // reset page to 0, on search term change
  const onSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(evt.target.value)
    setPage(0);
  };


  // const personQuery = api.person.all.useQuery()
  const { data, fetchNextPage, } = api.person.getPagedSearch.useInfiniteQuery({
    limit: 10,
    search: debouncedSearch
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const handleFetchNextPage = () => {
    void fetchNextPage();
    setPage((prev) => prev + 1);
  };

  const handleFetchPreviousPage = () => {
    setPage((prev) => prev - 1);
  };

  const toShow = data?.pages[page]?.items;
  const nextCursor = data?.pages[page]?.nextCursor;

  return (
    <>
      <Head>
        <title>Epicentre - Persons</title>
        <meta name="description" content="Epicentre" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex ">
        <main className="order-2 mx-4 mt-4 mb-24 flex-[1_0_16rem]">

          <h2 className="text-2xl font-extrabold tracking-tight my-4">Persons</h2>

          <form className="flex items-center mb-4">
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
              </div>
              <input onChange={onSearchChange} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
            </div>
            <button type="submit" className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <span className="sr-only">Search</span>
            </button>
          </form>

          {data ? (
            toShow?.length === 0 ? (
              <span>There are no people!</span>
            ) : (
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3">
                        City
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {toShow?.map((p) => (
                      <tr key={p.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 ">
                          <Link href={`/persons/${p.id}`}>{p.family_name}, {p.given_name}</Link>
                        </th>
                        <td className="px-6 py-4">
                          {p.email}
                        </td>
                        <td className="px-6 py-4">
                          {p.city},  {p.province} {p.country}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* pagination */}
                <div className="flex flex-col items-center my-4">
                  <span className="text-sm text-gray-700 dark:text-gray-400">
                    Showing Page <span className="font-semibold text-gray-900 dark:text-white">{page + 1}</span>
                  </span>
                  <div className="inline-flex mt-2 xs:mt-0">
                    {/* text-gray-500 bg-white border border-gray-300 */}
                    <button disabled={page <= 0} onClick={handleFetchPreviousPage} className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50">
                      <svg aria-hidden="true" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd"></path></svg>
                      Prev
                    </button>
                    <button disabled={!nextCursor} onClick={handleFetchNextPage} className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50">
                      Next
                      <svg aria-hidden="true" className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          ) : (
            <p>Loading Persons...</p>
          )}

        </main >
      </div>
    </>
  );
};

export default PersonsPage;


