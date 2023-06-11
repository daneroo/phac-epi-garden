import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  BoltIcon,
  BookOpenIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  CheckBadgeIcon,
  CheckCircleIcon,
  CheckIcon,
  DocumentCheckIcon,
  LightBulbIcon,
  LinkIcon,
  PencilIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { signIn, signOut } from "next-auth/react";

import { api, type RouterOutputs } from "~/utils/api";
import { LogoVariant } from "~/components/logo";

// Hmm thinks my keys are string or number, but they are all strings
function formatKey(key: string | number): string {
  if (typeof key === "number") return key.toString();
  // Convert snake_case to space separated words and capitalize each word
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function iconForKey(key: string | number) {
  // Could not get the typing to work for
  // const icons = { key: SVGComponentTransferFunctionElement, key2: OtherIcon }
  if (key === "organizations") {
    return UserGroupIcon;
  }
  if (key === "org_tiers") {
    return BuildingOffice2Icon;
  }
  if (key === "persons") {
    return UserIcon;
  }
  if (key === "capabilities") {
    return BoltIcon;
  }
  if (key === "affiliations") {
    return LinkIcon;
  }
  if (key === "publications") {
    return BookOpenIcon;
  }
  if (key === "publication_contributors") {
    return PencilIcon;
  }
  if (key === "requirements") {
    return DocumentCheckIcon;
  }
  if (key === "roles") {
    return CheckBadgeIcon;
  }
  if (key === "skills") {
    return LightBulbIcon;
  }
  if (key === "tasks") {
    return CheckCircleIcon;
  }
  if (key === "teams") {
    return UsersIcon;
  }
  if (key === "valid_roles") {
    return ShieldCheckIcon;
  }
  if (key === "validations") {
    return CheckIcon;
  }
  if (key === "works") {
    return BriefcaseIcon;
  }
  return UserIcon;
}
const GotoCard: React.FC<{
  stat: RouterOutputs["stat"]["all"][number];
}> = ({ stat }) => {
  const hasLink = ["organizations", "persons"].includes(stat.name.toString());
  const link = hasLink ? "/" + stat.name.toString() : "#";
  const Icon = iconForKey(stat.name);
  return (
    <div className="max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
      <Link href={link} className={hasLink ? "underline" : ""}>
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          <span className="flex items-center gap-1 stroke-current">
            <Icon className="h-6 w-6" />
            <span>{formatKey(stat.name)}</span>
          </span>
        </h5>
      </Link>
      <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
        There are currently {stat.count} entries in the {stat.name} table.
      </p>
    </div>
  );
};
const Home: NextPage = () => {
  const statQuery = api.stat.all.useQuery();
  return (
    <>
      <Head>
        <title>Epicenter</title>
        <meta name="description" content="Epicenter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto max-w-3xl px-4 pb-4 md:max-w-5xl">
        <div className="flex flex-col items-center">
          <div className="container mt-12 flex flex-col items-center justify-center gap-4 px-4 py-8">
            <h1 className="text-5xl font-extrabold sm:text-[5rem]">
              Epi<span className="text-red-500">center</span>
            </h1>
            <AuthShowcase />

            <LogoVariant
              variant={statQuery.isLoading ? "spinner" : "pulsing"}
            />

            {statQuery.data ? (
              statQuery.data?.length === 0 ? (
                <p>There are no stats!</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* 
                  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                   */}
                  {statQuery.data?.map((p) => (
                    <GotoCard key={p.name} stat={p}></GotoCard>
                  ))}
                </div>
              )
            ) : (
              <p>Loading Stats...</p>
            )}
          </div>
        </div>
      </main>
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
        <p className="text-center text-2xl">
          {session && <span>Logged in as {session?.user?.name}</span>}
          {secretMessage && <span> - {secretMessage}</span>}
        </p>
      )}
      <button
        className="rounded-full bg-black/20 px-10 py-3 font-semibold no-underline transition hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20"
        onClick={session ? () => void signOut() : () => void signIn()}
      >
        {session ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
