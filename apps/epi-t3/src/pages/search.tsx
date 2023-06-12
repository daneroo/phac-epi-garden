import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Tabs } from "flowbite-react";

import { api } from "~/utils/api";
import {
  SkillPills,
  SkillSearch,
  skills,
  type Skill,
} from "~/components/taxonomy";

const SearchPage: NextPage = () => {
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [page, setPage] = useState(0);

  const onPillClickSelect = (skill: Skill) => {
    // You may want to prevent the same skill from being added multiple times
    if (
      !selectedSkills.find(
        (s) => s.domain === skill.domain && s.name_en === skill.name_en,
      )
    ) {
      setSelectedSkills([...selectedSkills, skill]);
      setPage(0);
    }
  };

  const onPillClickRemove = (skillToRemove: Skill) => {
    setSelectedSkills(
      selectedSkills.filter(
        (skill) =>
          !(
            skill.domain === skillToRemove.domain &&
            skill.name_en === skillToRemove.name_en
          ),
      ),
    );
    setPage(0);
  };

  // skills that are notSelected
  const remainingSkills = skills.filter(
    (skill) =>
      !selectedSkills.some(
        (clickedSkill) =>
          clickedSkill.domain === skill.domain &&
          clickedSkill.name_en === skill.name_en,
      ),
  );
  let count;
  {
    const { data } = api.person.getSkillSearchCount.useQuery({
      skills: selectedSkills,
    });
    count = data?.count;
  }

  const limit = 50;
  const { data, fetchNextPage } =
    api.person.getPagedSkillSearch.useInfiniteQuery(
      {
        limit: limit,
        skills: selectedSkills,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const handleFetchNextPage = () => {
    void fetchNextPage();
    setPage((prev) => prev + 1);
  };

  const handleFetchPreviousPage = () => {
    setPage((prev) => prev - 1);
  };

  const toShow = data?.pages[page]?.items;
  const nextCursor = data?.pages[page]?.nextCursor;

  return (
    <>
      <Head>
        <title>Skill Search - Epicenter</title>
        <meta name="description" content="Taxonomy - Epicenter" />
      </Head>
      <main className="mx-auto max-w-3xl px-4 pb-4 md:max-w-5xl">
        <h2 className="my-4 text-2xl font-extrabold">Skill Search</h2>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            Searching for:{" "}
            <SkillPills
              skills={selectedSkills}
              onClick={onPillClickRemove}
              emptyMessage="Anyone! (Add some criteria to refine.)"
            />
            {selectedSkills.length > 0 && (
              <button
                onClick={() => setSelectedSkills([])}
                className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
              >
                Clear All
              </button>
            )}
          </div>
          <div>Resulting in {count} persons.</div>
        </div>

        <Tabs.Group aria-label="Tabs with underline" style="underline">
          <Tabs.Item active title="1-Search for Skills">
            <SkillSearch
              onPillClickSelect={onPillClickSelect}
              allSkills={remainingSkills}
            />
          </Tabs.Item>
          <Tabs.Item title="2-Show Selected Persons">
            These are the persons that meet your skill search criteria
            {data ? (
              toShow?.length === 0 ? (
                <span>There are no people!</span>
              ) : (
                <div className="relative overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-50 text-xs uppercase dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Skills / Capabilities
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {toShow?.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                          <th scope="row" className="px-6 py-4 ">
                            <Link href={`/persons/${p.id}`}>
                              {p.family_name}, {p.given_name}
                            </Link>
                          </th>
                          <td className="px-6 py-4">
                            {p.capabilities.map((c) => c.name_en).join(", ")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* pagination */}
                  <div className="my-4 flex flex-col items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-400">
                      Showing Page{" "}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {page + 1}
                      </span>
                    </span>
                    <div className="xs:mt-0 mt-2 inline-flex">
                      <button
                        disabled={page <= 0}
                        onClick={handleFetchPreviousPage}
                        className="inline-flex items-center rounded-l bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <svg
                          aria-hidden="true"
                          className="mr-2 h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        Prev
                      </button>
                      <button
                        disabled={!nextCursor}
                        onClick={handleFetchNextPage}
                        className="inline-flex items-center rounded-r border-0 border-l border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        Next
                        <svg
                          aria-hidden="true"
                          className="ml-2 h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <p>Loading Persons...</p>
            )}
          </Tabs.Item>
          {/* <Tabs.Item title="Perform an Action">
            <ul>
              <li>Print report</li>
              <li>Send some emails</li>
            </ul>
          </Tabs.Item> */}
        </Tabs.Group>
      </main>
    </>
  );
};

export default SearchPage;
