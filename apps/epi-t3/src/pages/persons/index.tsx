import type { NextPage } from "next";
import Head from "next/head";
import Link from 'next/link'

import { api } from "~/utils/api";

const PersonsPage: NextPage = () => {
  const personQuery = api.person.all.useQuery()
  return (
    <>
      <Head>
        <title>Epicentre - Persons</title>
        <meta name="description" content="Epicentre" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center">

        <h2 className="text-2xl font-extrabold tracking-tight my-4">Persons</h2>
        {personQuery.data ? (
          personQuery.data?.length === 0 ? (
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
                  {personQuery.data?.map((p) => (
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
            </div>
          )
        ) : (
          <p>Loading Organizations...</p>
        )}

      </main >
    </>
  );
};

export default PersonsPage;


