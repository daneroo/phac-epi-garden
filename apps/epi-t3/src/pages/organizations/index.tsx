import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

const OrganizationsPage: NextPage = () => {
  const orgQuery = api.organization.all.useQuery();
  return (
    <>
      <Head>
        <title>Epicenter</title>
        <meta name="description" content="Epicenter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto max-w-3xl px-4 pb-4 md:max-w-5xl">
        <h2 className="my-4 text-2xl font-extrabold">Organizations</h2>
        {orgQuery.data ? (
          orgQuery.data?.length === 0 ? (
            <span>There are no organizations!</span>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase dark:bg-gray-700 dark:text-gray-400">
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
                    <tr
                      key={o.id}
                      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <th scope="row" className="px-6 py-4 ">
                        <Link href={`/organizations/${o.id}`}>{o.name_en}</Link>
                      </th>
                      <td className="px-6 py-4">{o.name_fr}</td>
                      <td className="px-6 py-4">
                        {o.acronym_en} / {o.acronym_fr}
                      </td>
                      <td className="px-6 py-4">{o.org_type}</td>
                      <td className="px-6 py-4">{o.url}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <p>Loading Organizations...</p>
        )}
      </main>
    </>
  );
};

export default OrganizationsPage;
