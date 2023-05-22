import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut } from "next-auth/react";

import { api, type RouterOutputs } from "~/utils/api";

const StatCard: React.FC<{
  // stat: RouterOutputs["stat"]["all"][number];
  stat: RouterOutputs["stat"]["all"][number];
}> = ({ stat }) => {
  // Hmm thinks my keys are string or number, but they are all strings
  function formatKey(key: string | number): string {
    if (typeof key === 'number') return key.toString();
    // Convert snake_case to space separated words and capitalize each word
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  return (
    <div
      className="block rounded-lg bg-white p-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
      <h5
        className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
        {formatKey(stat.name)}
      </h5>
      <p className="mb-1 text-base text-neutral-600 dark:text-neutral-200">
        There are currently {stat.count} entries in the {stat.name} table.
      </p>
    </div>);
};

const Home: NextPage = () => {
  const statQuery = api.stat.all.useQuery();
  return (
    <>
      <Head>
        <title>Epicentre</title>
        <meta name="description" content="Epicentre" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* h-screen */}
      <main className="flex  flex-col items-center bg-gradient-to-b from-slate-300 to-slate-700 text-white">
        <div className="container mt-12 flex flex-col items-center justify-center gap-4 px-4 py-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Epi<span className="text-red-500">Centre</span>
          </h1>
          <AuthShowcase />

          <h2 className="text-xl font-extrabold tracking-tight">Table Stats</h2>
          {statQuery.data ? (
            statQuery.data?.length === 0 ? (
              <span>There are no stats!</span>
            ) : (
              <div className="flex flex-col gap-2">
                {/* {statQuery.data?.map((p) => <li key={p.name}>{p.name}: {p.count}</li>)} */}
                {statQuery.data?.map((p) => <StatCard key={p.name} stat={p} ></StatCard>)}
              </div>
            )
          ) : (
            <p>Loading Stats...</p>
          )}

        </div>
      </main >
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: session } = api.auth.getSession.useQuery();

  const { data: secretMessage } = api.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: !!session?.user },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {session?.user && (
        <p className="text-center text-2xl text-white">
          {session && <span>Logged in as {session?.user?.name}</span>}
          {secretMessage && <span> - {secretMessage}</span>}
        </p>
      )}
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={session ? () => void signOut() : () => void signIn()}
      >
        {session ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
