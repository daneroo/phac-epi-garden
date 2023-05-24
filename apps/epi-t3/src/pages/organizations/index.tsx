import type { NextPage } from "next";
import Head from "next/head";
import Link from 'next/link'

import { api } from "~/utils/api";

const OrganizationsPage: NextPage = () => {
  const orgQuery = api.organization.all.useQuery()
  return (
    <>
      <Head>
        <title>Epicentre</title>
        <meta name="description" content="Epicentre" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center">

        <h2 className="text-2xl font-extrabold tracking-tight my-4">Organizations</h2>
        {orgQuery.data ? (
          orgQuery.data?.length === 0 ? (
            <span>There are no stats!</span>
          ) : (

            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Organization Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      FR
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Acronym
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3">
                      URL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orgQuery.data?.map((o) => (
                    <tr key={o.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" className="px-6 py-4 ">
                        <Link href={`/organizations/${o.id}`}>{o.name_en}</Link>
                      </th>
                      <td className="px-6 py-4">
                        {o.name_fr}
                      </td>
                      <td className="px-6 py-4">
                        {o.acronym_en} / {o.acronym_fr}
                      </td>
                      <td className="px-6 py-4">
                        {o.org_type}
                      </td>
                      <td className="px-6 py-4">
                        {o.url}
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

export default OrganizationsPage;


