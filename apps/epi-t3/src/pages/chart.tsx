// eslint disable-all
import { type SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

import { api } from "~/utils/api";
import {
  type org_tier_ownerships,
  type org_tiers,
  type persons,
  type roles,
} from ".prisma/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const OrgChart = dynamic<any>(
  () =>
    import("~/components/orgchart").then((mod) => {
      setTimeout(() => {
        const k = document.querySelector<HTMLDivElement>("#react-org-chart");
        const height = k?.offsetHeight;
        const width = k?.offsetWidth;
        const svg = document.querySelector("#react-org-chart svg");
        svg?.setAttribute("viewBox", `0 0 ${width} ${height}`);
      }, 0);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return mod.OrgChart;
    }),
  {
    ssr: false, loading: () => <div>
      {/* loading */}
    </div>
  },
);

type ChartData = org_tiers & {
  org_tier_ownerships: (org_tier_ownerships & {
    persons: persons & {
      roles: roles[];
    };
  })[];
  other_org_tiers: (org_tiers & {
    org_tier_ownerships: org_tier_ownerships[];
  })[];
};

const getTree = (r: ChartData) => ({
  id: r.id,
  person: {
    id: r.id,
    avatar: "https://static.thenounproject.com/png/344179-200.png",
    name: r.name_en,
    title: "",
  },
  hasChild: r.org_tier_ownerships.length > 0,
  hasParent: false,
  isHighlight: false,
  children: [
    {
      id: `${r.id}-people`,
      person: {
        id: `${r.id}-people`,
        avatar:
          "https://previews.123rf.com/images/creativepriyanka/creativepriyanka1910/creativepriyanka191000645/132313863-team-icon.jpg",
        name: "People",
        title: "",
      },
      hasParent: true,
      hasChildren: true,
      children: r.org_tier_ownerships.map((o) => ({
        id: o.persons.id,
        person: {
          id: o.persons.id,
          avatar:
            "https://previews.123rf.com/images/creativepriyanka/creativepriyanka1910/creativepriyanka191000645/132313863-team-icon.jpg",
          name: `${o.persons.given_name} ${o.persons.family_name}`,
          title: o.persons.roles?.map((r) => r.title_en).join(", "),
        },
        hasChild: false,
        hasParent: true,
        isHighlight: false,
      })),
    },
    {
      id: `${r.id}-org`,
      person: {
        id: `${r.id}-org`,
        avatar: "https://static.thenounproject.com/png/102629-200.png",
        name: "Org Tiers",
        title: "",
      },
      hasParent: true,
      hasChildren: r.other_org_tiers.length > 0,
      children: r.other_org_tiers.map((o) => ({
        id: o.id,
        person: {
          id: o.id,
          avatar: "https://static.thenounproject.com/png/344179-200.png",
          name: o.name_en,
          title: "",
        },
        hasChild: o.org_tier_ownerships.length > 0,
        hasParent: true,
        isHighlight: false,
      })),
    },
  ],
});

type NodePerson = {
  id: string;
  avatar: string;
  department: string;
  name: string;
  title: string;
  totalReports?: number;
};

type NodeInfo = {
  id: string;
  person: NodePerson;
  hasChild: boolean;
  hasParent: boolean;
  isHighlight: boolean;
  children: NodeInfo[];
};

type OrgInfo = NodeInfo & {
  source: org_tiers & {
    org_tier_ownerships: (org_tier_ownerships & {
      persons: persons & {
        roles: roles[];
      };
    })[];
  };
};

type OrgNodes = {
  [id: string]: OrgInfo;
};

const ChartPersonsPage: NextPage = () => {
  const [childId, setChildId] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childLoading = useRef<any>();
  const [mode, setMode] = useState(1);


  // reset page to 0, on search term change

  const orgTiers = api.person.getPersonsByOrgTier.useQuery(undefined, {
    enabled: mode === 1,
  });

  const r = api.person.getChart.useQuery({}, { enabled: mode === 2 });

  const child = api.person.getChart.useQuery(
    { id: childId },
    { enabled: false },
  );

  const handleModeSwitch = (mode: number) => {
    setMode(mode);
    orgTiers.remove();
    r.remove();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    if (mode === 1) orgTiers.refetch();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    if (mode === 2) r.refetch();
  };

  const handleChildLoad = (d: { id: SetStateAction<string>; }) => {
    return new Promise((resolve) => {
      childLoading.current = resolve;
      setChildId(d.id);
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        child.refetch();
      }, 0);
    });
  };

  useEffect(() => {
    if (child.data) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      childLoading.current(getTree(child.data).children);
    }
  }, [child.data]);

  const root = useMemo(() => r.data && getTree(r.data), [r]);

  const config = useRef({});

  const loadConfig = useCallback(() => {
    return config.current;
  }, [config]);

  const onConfigChange = useCallback(
    (conf: object) => {
      config.current = conf;
    },
    [config],
  );

  const org = useMemo(() => {
    const d: OrgNodes = {};
    let rootNode: OrgInfo | null = null;
    if (!orgTiers.data) return null;
    orgTiers.data.forEach((r) => {
      const obj: OrgInfo = {
        source: r,
        id: r.id,
        person: {
          id: r.org_tier_ownerships[0]?.id ? r.org_tier_ownerships[0]?.id : '',
          avatar: "https://freesvg.org/img/abstract-user-flat-4.png",
          department: r.name_en,
          name: `${r.org_tier_ownerships[0]?.persons.given_name} ${r.org_tier_ownerships[0]?.persons.family_name}`,
          title: `${r.org_tier_ownerships[0]?.persons.roles[0]?.title_en}`,
        },
        hasChild: false,
        hasParent: r.parent_tier !== null,
        isHighlight: false,
        children: [],
      };
      d[r.id] = obj;
      if (r.parent_tier === null) rootNode = obj;
    });
    if (rootNode === null) return null;

    Object.keys(d).forEach((k) => {
      const obj = d[k];
      if (obj?.source.parent_tier) {
        const target = d[obj?.source.parent_tier];
        if (target) {
          target.children.push(obj);
          target.hasChild = true;
          obj.hasParent = true;
        }
      }
    });

    Object.keys(d).forEach((k) => {
      const obj = d[k];
      if (obj?.source.parent_tier && obj.children.length === 0) {
        const parent = d[obj.source.parent_tier];
        if (parent) {
          parent.children.splice(parent.children.indexOf(obj), 1);
          parent.children.push(obj);
        }
      }
      if (obj?.person) obj.person.totalReports = obj?.children.length;
    });
    return rootNode;
  }, [orgTiers]);

  return (
    <>
      <Head>
        <title>Chart - Persons - Epicenter</title>
        <meta name="description" content="Chart - Persons - Epicenter" />
      </Head>
      {/* required by react-org-chart */}
      <div id="root">


        <main className="mx-auto max-w-3xl px-4 pb-4 md:max-w-5xl lg:max-w-full">
          <h2 className="my-4 text-2xl font-extrabold">Chart of Persons</h2>

          <form className="mb-4 flex w-full items-center">
            <div className="flex w-full justify-end">
              <button
                type="button"
                className={`ml-2 rounded-lg border border-gray-400 ${mode === 1 ? "bg-stone-500" : "bg-gray-500"
                  } p-2.5 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800`}
                onClick={() => handleModeSwitch(1)}
              >
                Mode 1
              </button>
              <button
                type="button"
                className={`ml-2 rounded-lg border border-gray-400 ${mode === 2 ? "bg-stone-500" : "bg-gray-500"
                  } p-2.5 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800`}
                onClick={() => handleModeSwitch(2)}
              >
                Mode 2
              </button>

              <button
                id="zoom-in"
                type="button"
                className="ml-2 rounded-lg border border-gray-400 bg-gray-500 p-2.5 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                title="Zoom In"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  stroke="currentColor"
                  viewBox="0 0 122.879 119.801"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M49.991,0h0.015v0.006c13.794,0.004,26.294,5.601,35.336,14.645c9.026,9.031,14.618,21.515,14.628,35.303h0.006v0.034v0.04 h-0.006c-0.005,5.557-0.918,10.905-2.594,15.892c-0.281,0.837-0.576,1.641-0.877,2.409v0.007c-1.446,3.661-3.315,7.12-5.548,10.307 l29.08,26.14l0.018,0.015l0.157,0.146l0.012,0.012c1.641,1.563,2.535,3.656,2.648,5.779c0.11,2.1-0.538,4.248-1.976,5.971 l-0.011,0.016l-0.176,0.204l-0.039,0.046l-0.145,0.155l-0.011,0.011c-1.563,1.642-3.656,2.539-5.782,2.651 c-2.104,0.111-4.254-0.54-5.975-1.978l-0.012-0.012l-0.203-0.175l-0.029-0.024L78.764,90.865c-0.88,0.62-1.779,1.207-2.687,1.763 c-1.234,0.756-2.51,1.467-3.816,2.117c-6.699,3.342-14.266,5.223-22.27,5.223v0.006h-0.016v-0.006 c-13.797-0.005-26.297-5.601-35.334-14.644l-0.004,0.005C5.608,76.3,0.016,63.81,0.007,50.021H0v-0.033v-0.016h0.007 c0.005-13.799,5.601-26.297,14.646-35.339C23.684,5.607,36.169,0.015,49.958,0.006V0H49.991L49.991,0z M67.787,43.397 c1.21-0.007,2.353,0.312,3.322,0.872l-0.002,0.002c0.365,0.21,0.708,0.454,1.01,0.715c0.306,0.264,0.594,0.569,0.851,0.895h0.004 c0.873,1.11,1.397,2.522,1.394,4.053c-0.003,1.216-0.335,2.358-0.906,3.335c-0.454,0.78-1.069,1.461-1.791,1.996 c-0.354,0.261-0.751,0.496-1.168,0.688v0.002c-0.823,0.378-1.749,0.595-2.722,0.6l-11.051,0.08l-0.08,11.062 c-0.004,1.034-0.254,2.02-0.688,2.886c-0.188,0.374-0.417,0.737-0.678,1.074l-0.006,0.007c-0.257,0.329-0.551,0.644-0.866,0.919 c-1.169,1.025-2.713,1.649-4.381,1.649v-0.007c-0.609,0-1.195-0.082-1.743-0.232c-1.116-0.306-2.115-0.903-2.899-1.689 c-0.788-0.791-1.377-1.787-1.672-2.893v-0.006c-0.144-0.543-0.22-1.128-0.215-1.728v-0.005l0.075-10.945l-10.962,0.076 c-1.209,0.011-2.354-0.31-3.327-0.873l0.002-0.002c-0.37-0.212-0.715-0.458-1.016-0.722c-0.306-0.264-0.589-0.567-0.844-0.891 h-0.004c-0.873-1.112-1.397-2.522-1.393-4.053c0.002-1.213,0.337-2.354,0.906-3.328l-0.004-0.002 c0.376-0.642,0.869-1.225,1.442-1.714h0.004c0.574-0.489,1.236-0.883,1.942-1.151c0.704-0.266,1.484-0.418,2.296-0.423 l11.051-0.082l0.08-11.062c0.004-1.207,0.345-2.345,0.921-3.309l0.004,0.002c0.224-0.374,0.467-0.715,0.727-1.003 c0.264-0.296,0.576-0.584,0.908-0.839l0.005-0.004v0.002c1.121-0.861,2.533-1.379,4.055-1.375c1.211,0.002,2.352,0.332,3.317,0.897 c0.479,0.279,0.928,0.631,1.32,1.025l0.004-0.004c0.383,0.383,0.73,0.834,1.019,1.333c0.56,0.968,0.879,2.104,0.868,3.304 l-0.075,10.942L67.787,43.397L67.787,43.397z M50.006,11.212v0.006h-0.015h-0.034v-0.006C39.274,11.219,29.59,15.56,22.581,22.566 l0.002,0.002c-7.019,7.018-11.365,16.711-11.368,27.404h0.006v0.016v0.033h-0.006c0.006,10.683,4.347,20.365,11.354,27.377 l0.002-0.002c7.018,7.018,16.711,11.365,27.404,11.367v-0.007h0.016h0.033v0.007c10.685-0.007,20.367-4.348,27.381-11.359 c7.012-7.009,11.359-16.702,11.361-27.401H88.76v-0.015v-0.034h0.007C88.76,39.273,84.419,29.591,77.407,22.58v-0.007 C70.398,15.562,60.705,11.214,50.006,11.212L50.006,11.212z" />
                </svg>
              </button>
              <button
                id="zoom-out"
                type="button"
                title="Zoom Out"
                className="ml-2 rounded-lg border border-gray-400 bg-gray-500 p-2.5 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  stroke="currentColor"
                  viewBox="0 0 122.879 119.801"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M49.991,0h0.015v0.006c13.794,0.004,26.294,5.601,35.336,14.645 c9.026,9.031,14.618,21.515,14.628,35.303h0.006v0.034v0.04h-0.006c-0.005,5.557-0.918,10.905-2.594,15.892 c-0.281,0.837-0.576,1.641-0.877,2.409v0.007c-1.446,3.661-3.315,7.12-5.548,10.307l29.08,26.14l0.018,0.015l0.157,0.146 l0.012,0.012c1.641,1.563,2.535,3.656,2.648,5.779c0.11,2.1-0.538,4.248-1.976,5.971l-0.011,0.016l-0.176,0.204l-0.039,0.046 l-0.145,0.155l-0.011,0.011c-1.563,1.642-3.656,2.539-5.782,2.651c-2.104,0.111-4.254-0.54-5.975-1.978l-0.012-0.012l-0.203-0.175 l-0.029-0.024L78.764,90.865c-0.88,0.62-1.779,1.207-2.687,1.763c-1.234,0.756-2.51,1.467-3.816,2.117 c-6.699,3.342-14.266,5.223-22.27,5.223v0.006h-0.016v-0.006c-13.797-0.005-26.297-5.601-35.334-14.644l-0.004,0.005 C5.608,76.3,0.016,63.81,0.007,50.021H0v-0.033v-0.016h0.007c0.005-13.799,5.601-26.297,14.646-35.339 C23.684,5.607,36.169,0.015,49.958,0.006V0H49.991L49.991,0z M67.787,43.397c1.21-0.007,2.353,0.312,3.322,0.872l-0.002,0.002 c0.365,0.21,0.708,0.454,1.01,0.715c0.306,0.264,0.594,0.569,0.851,0.895h0.004c0.873,1.11,1.397,2.522,1.394,4.053 c-0.003,1.216-0.335,2.358-0.906,3.335c-0.454,0.78-1.069,1.461-1.791,1.996c-0.354,0.261-0.751,0.496-1.168,0.688v0.002 c-0.823,0.378-1.749,0.595-2.722,0.6l-35.166,0.248c-1.209,0.011-2.354-0.31-3.327-0.873l0.002-0.002 c-0.37-0.212-0.715-0.458-1.016-0.722c-0.306-0.264-0.589-0.567-0.844-0.891h-0.004c-0.873-1.112-1.397-2.522-1.393-4.053 c0.002-1.213,0.337-2.354,0.906-3.328l-0.004-0.002c0.376-0.642,0.869-1.225,1.442-1.714h0.004 c0.574-0.489,1.236-0.883,1.942-1.151c0.704-0.266,1.484-0.418,2.296-0.423L67.787,43.397L67.787,43.397z M50.006,11.212v0.006 h-0.015h-0.034v-0.006C39.274,11.219,29.59,15.56,22.581,22.566l0.002,0.002c-7.019,7.018-11.365,16.711-11.368,27.404h0.006v0.016 v0.033h-0.006c0.006,10.683,4.347,20.365,11.354,27.377l0.002-0.002c7.018,7.018,16.711,11.365,27.404,11.367v-0.007h0.016h0.033 v0.007c10.685-0.007,20.367-4.348,27.381-11.359c7.012-7.009,11.359-16.702,11.361-27.401H88.76v-0.015v-0.034h0.007 C88.76,39.273,84.419,29.591,77.407,22.58v-0.007C70.398,15.562,60.705,11.214,50.006,11.212L50.006,11.212z"
                  />
                </svg>
              </button>
            </div>
          </form>

          <div className="relative w-full border-2">
            {(mode === 1 && org) || (mode === 2 && root) ? (
              <OrgChart
                tree={mode === 1 ? org : root}
                onConfigChange={onConfigChange}
                loadConfig={loadConfig}
                loadImage={() => {
                  return Promise.resolve();
                }}
                loadParent={(/*d: any*/) => {
                  // for lazy loading
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                loadChildren={(d: any) => {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  return handleChildLoad(d);
                }}
              />
            ) : (
              <p>Loading Chart...</p>
            )}
          </div>
        </main>
      </div>

    </>
  );
};

export default ChartPersonsPage;
