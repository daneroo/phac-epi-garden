import type { NextPage } from "next";
import { useRouter } from 'next/router';
import Head from "next/head";

import { api } from "~/utils/api";

const OrganizationPage: NextPage = () => {
  const id = useRouter().query.id as string;
  const orgQuery = api.organization.byId.useQuery({ id })

  return (
    <>
      <Head>
        <title>Epicenter</title>
        <meta name="description" content="Epicenter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-3xl mx-auto px-4 pb-4 md:max-w-5xl">
        <h2 className="text-2xl font-extrabold my-4">Organization</h2>
        {orgQuery.data ? (
          <>
            <h3 className="my-4 text-xl font-bold">{orgQuery.data.name_en}</h3>
            <h3 className="my-4 text-l font-bold">Organizational Tiers ({orgQuery.data.org_tiers.length})</h3>
            {orgQuery.data.org_tiers.length === 0 ? (
              <p>There are no tiers</p>
            ) : (

              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Tier Level
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orgQuery.data.org_tiers.map((o) => (
                      <tr key={o.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 ">
                          {o.tier_level}
                        </th>
                        <td className="px-6 py-4">
                          {o.name_en}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* <pre>{JSON.stringify(orgQuery.data, null, 2)}</pre> */}
          </>) : (
          <p>Loading Organization...</p>
        )}
      </main>
    </>
  );
}

export default OrganizationPage;
