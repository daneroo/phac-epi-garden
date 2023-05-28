import type { NextPage } from "next";
import Head from "next/head";
import Link from 'next/link'
import { LogoVariant } from "~/components/logo";
import {
  BuildingOffice2Icon,
  UserIcon,
  UserGroupIcon,
  BoltIcon,
  LinkIcon,
  BookOpenIcon,
  PencilIcon,
  DocumentCheckIcon,
  CheckBadgeIcon,
  LightBulbIcon,
  CheckCircleIcon,
  UsersIcon,
  ShieldCheckIcon,
  CheckIcon,
  BriefcaseIcon
} from '@heroicons/react/24/solid'

import { signIn, signOut } from "next-auth/react";

import { api, type RouterOutputs } from "~/utils/api";
import React from "react";

// Hmm thinks my keys are string or number, but they are all strings
function formatKey(key: string | number): string {
  if (typeof key === 'number') return key.toString();
  // Convert snake_case to space separated words and capitalize each word
  return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}


function iconForKey(key: string | number): React.ReactElement {

  const icons = {
    "organizations": UserGroupIcon,  // Multiple users representing an organization
    "org_tiers": BuildingOffice2Icon, // Building icon to represent organizational tiers
    "persons": UserIcon,             // Single user representing a person
    "capabilities": BoltIcon, // Lightning bolt represents power or capability
    "affiliations": LinkIcon,        // Link or chain icon representing affiliations
    "publications": BookOpenIcon,    // Open book for publications
    "publication_contributors": PencilIcon, // Pencil for contributors (who write or edit)
    "requirements": DocumentCheckIcon, // Report document for requirements
    "roles": CheckBadgeIcon,         // Badge for roles
    "skills": LightBulbIcon,         // Lightbulb representing skills or ideas
    "tasks": CheckCircleIcon,        // Check circle for tasks or to-dos
    "teams": UsersIcon,              // Group of users for teams
    "valid_roles": ShieldCheckIcon,  // Shield with checkmark for valid roles (security concept)
    "validations": CheckIcon,        // Checkmark for validations
    "works": BriefcaseIcon,          // Briefcase for work items
  }
  if (typeof key === 'string' && key in icons) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return icons[key]
  }
  return UserIcon
}

const GotoCard: React.FC<{
  stat: RouterOutputs["stat"]["all"][number];
}> = ({ stat }) => {
  const hasLink = ['organizations', 'persons'].includes(stat.name.toString())
  const link = hasLink ? ('/' + stat.name.toString()) : '#'
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const Icon = iconForKey(stat.name)
  return (
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <Link href={link} className={hasLink ? 'underline' : ''}>
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          <span className="flex items-center stroke-current gap-1">
            <Icon className="h-6 w-6" />
            <span>{formatKey(stat.name)}</span>
          </span>

        </h5>
      </Link>
      <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
        There are currently {stat.count} entries in the {stat.name} table.
      </p>
    </div>
  )
}
const Home: NextPage = () => {
  const statQuery = api.stat.all.useQuery();
  console.log(JSON.stringify(statQuery.data, null, 2))
  return (
    <>
      <Head>
        <title>Epicenter</title>
        <meta name="description" content="Epicenter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-3xl mx-auto px-4 pb-4 md:max-w-5xl">

        <div className="flex flex-col items-center">
          <div className="container mt-12 flex flex-col items-center justify-center gap-4 px-4 py-8">
            <h1 className="text-5xl font-extrabold sm:text-[5rem]">
              Epi<span className="text-red-500">center</span>
            </h1>
            <AuthShowcase />

            <LogoVariant variant={statQuery.isLoading ? 'spinner' : 'pulsing'} />

            {statQuery.data ? (
              statQuery.data?.length === 0 ? (
                <p>There are no stats!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* 
                  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                   */}
                  {statQuery.data?.map((p) => <GotoCard key={p.name} stat={p} ></GotoCard>)}
                </div>
              )
            ) : (
              <p>Loading Stats...</p>
            )}

          </div>
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
        <p className="text-center text-2xl">
          {session && <span>Logged in as {session?.user?.name}</span>}
          {secretMessage && <span> - {secretMessage}</span>}
        </p>
      )}
      <button
        className="rounded-full bg-black/20 hover:bg-black/10 dark:bg-white/10 px-10 py-3 font-semibold no-underline transition dark:hover:bg-white/20"
        onClick={session ? () => void signOut() : () => void signIn()}
      >
        {session ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
