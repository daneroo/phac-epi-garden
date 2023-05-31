import type { NextPage } from "next";
import { useRouter } from 'next/router';
import Head from "next/head";
import { Tabs } from 'flowbite-react';

import { api } from "~/utils/api";
import { OrgAsTree } from "~/components/orgTier/tree";
import { OrgAsTable } from "~/components/orgTier/table";
import { type org_tiers } from "@phac/db";

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
              <ViewTabs org_tiers={orgQuery.data.org_tiers} />
            )}

            {/* <pre>{JSON.stringify(orgQuery.data, null, 2)}</pre> */}
          </>) : (
          <p>Loading Organization...</p>
        )}
      </main>
    </>
  );
}

function ViewTabs({ org_tiers }: { org_tiers: org_tiers[] }) {
  return (
    <Tabs.Group
      aria-label="Tabs with underline"
      style="underline"
    >
      <Tabs.Item
        active
        title="Tree"
      >
        <OrgAsTree org_tiers={org_tiers} />
      </Tabs.Item>
      <Tabs.Item title="Table">
        <OrgAsTable org_tiers={org_tiers} />

      </Tabs.Item>
    </Tabs.Group>
  )
}
export default OrganizationPage;
