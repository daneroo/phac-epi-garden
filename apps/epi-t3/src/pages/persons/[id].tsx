import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { api } from "~/utils/api";

const PersonPage: NextPage = () => {
  const id = useRouter().query.id as string;
  const personQuery = api.person.byId.useQuery({ id });

  // should be 0 or 1 active role
  const activeRoles = personQuery.data
    ? personQuery.data.roles.filter((r) => r.active)
    : [];
  const inactiveRoles = personQuery.data
    ? personQuery.data.roles.filter((r) => !r.active)
    : [];
  return (
    <>
      <Head>
        <title>Person - Epicenter</title>
        <meta name="description" content="Person - Epicenter" />
      </Head>
      <main className="mx-auto max-w-3xl px-4 pb-4 md:max-w-5xl">
        <h2 className="my-4 text-2xl font-extrabold">Person</h2>
        {personQuery.data ? (
          <>
            <h3 className="my-4 text-xl font-bold">
              {personQuery.data.given_name} {personQuery.data.family_name}
            </h3>
            <ul>
              <li>
                {personQuery.data.city}, {personQuery.data.province}{" "}
                {personQuery.data.postal_code}, {personQuery.data.country}
              </li>
              <li>{personQuery.data.email}</li>
              <li>{personQuery.data.phone}</li>
            </ul>
            <h3 className="text-l my-4 font-bold">Role</h3>
            <ul className="mx-4 list-disc">
              {activeRoles.length > 0 ? (
                // should be at most 1 active role
                <li>
                  {activeRoles[0]?.title_en} {activeRoles[0]?.hr_group}-
                  {activeRoles[0]?.hr_level} Effort: {activeRoles[0]?.effort}
                </li>
              ) : (
                <></>
              )}
              {inactiveRoles.length > 0 && (
                <>
                  <li className="list-none italic">Past</li>
                  {inactiveRoles.map((r) => (
                    <li key={r.id}>
                      {r.title_en} {r.hr_group}-{r.hr_level} Effort: {r.effort}
                    </li>
                  ))}
                </>
              )}
            </ul>
            <h3 className="text-l my-4 font-bold">Capabilities</h3>
            <ul className="mx-4 list-disc">
              {personQuery.data.capabilities.map((c) => (
                <li key={c.id}>
                  {c.name_en} ({c.domain.toUpperCase()}){" "}
                  {c.validated_level?.toUpperCase()}
                </li>
              ))}
            </ul>

            {/* <pre>{JSON.stringify(personQuery.data, (_, v) => (typeof v === "bigint" ? v.toString() : v), 2)}</pre> */}
          </>
        ) : (
          <p>Loading Person...</p>
        )}
      </main>
    </>
  );
};

export default PersonPage;
