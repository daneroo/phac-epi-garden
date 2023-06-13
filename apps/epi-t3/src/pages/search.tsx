import React, { useEffect, useState, type ReactNode } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  ArrowDownCircleIcon,
  ArrowTopRightOnSquareIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Button, Modal, Tabs } from "flowbite-react";

import { api } from "~/utils/api";
import {
  SkillPills,
  SkillSearch,
  skills,
  type Skill,
} from "~/components/taxonomy";

const SearchPage: NextPage = () => {
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [selectedPersons, setSelectedPersons] = useState<string[]>([]);
  const [selectAllPersons, setSelectAllPersons] = useState(false);
  const [page, setPage] = useState(0);

  // Modal controls for my 2 actions
  const [openExportModal, setOpenExportModal] = useState<string | undefined>();
  const [openRFIModal, setOpenRFIModal] = useState<string | undefined>();

  const onClearAllSkills = () => {
    setSelectedSkills([]);
    // reset pagination when search criteria changes
    setPage(0);
    // reset selectedPersons when search criteria changes
    setSelectedPersons([]);
  };

  const onPillClickSelect = (skill: Skill) => {
    // You may want to prevent the same skill from being added multiple times
    if (
      !selectedSkills.find(
        (s) => s.domain === skill.domain && s.name_en === skill.name_en,
      )
    ) {
      setSelectedSkills([...selectedSkills, skill]);
      // reset pagination when search criteria changes
      setPage(0);
      // reset selectedPersons when search criteria changes
      setSelectedPersons([]);
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
    // reset pagination when search criteria changes
    setPage(0);
    // reset selectedPersons when search criteria changes
    setSelectedPersons([]);
  };

  const handleSelectPerson = (id: string) => {
    if (selectedPersons.includes(id)) {
      setSelectedPersons(selectedPersons.filter((personId) => personId !== id));
    } else {
      setSelectedPersons([...selectedPersons, id]);
    }
  };

  const handleSelectAllPersons = () => {
    if (selectAllPersons) {
      // Deselect all persons
      setSelectedPersons([]);
    } else {
      // Select all persons
      const allPersonIds = toShow?.map((p) => p.id) || [];
      setSelectedPersons(allPersonIds);
    }
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

  // const toShow = data?.pages[page]?.items;
  // TODO: CLEAN UP THE DATA AT SOURCE: emails contain spaces!
  const toShow = data?.pages[page]?.items?.map((person) => ({
    ...person,
    email: person.email.replace(/\s/g, ""),
  }));

  const nextCursor = data?.pages[page]?.nextCursor;

  // Update selectAllPersons state when selectedPersons or toShow changes
  useEffect(() => {
    if (selectedPersons.length === toShow?.length) {
      setSelectAllPersons(true);
    } else {
      setSelectAllPersons(false);
    }
  }, [selectedPersons, toShow]);

  const isSelectedAllPersonsIndeterminate =
    selectedPersons.length > 0 &&
    selectedPersons.length < (toShow?.length || 0);

  return (
    <>
      <Head>
        <title>Skill Search - Epicenter</title>
        <meta name="description" content="Taxonomy - Epicenter" />
      </Head>
      <main className="mx-auto max-w-3xl px-4 pb-4 md:max-w-5xl">
        <h2 className="my-4 text-2xl font-extrabold">Skill Search</h2>

        <div className="mb-4">
          <div>
            Searching for
            {/* singular skill */}
            {selectedSkills.length == 1 && (
              <span> people who have this skill: </span>
            )}
            {/* multiple (AND) skill */}
            {selectedSkills.length > 1 && (
              <span> people who have ALL these skills: </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 pl-4">
            <SkillPills
              skills={selectedSkills}
              onClick={onPillClickRemove}
              emptyMessage="Anyone! (Add some skills criteria to refine.)"
            />
            {selectedSkills.length > 0 && (
              <button
                onClick={onClearAllSkills}
                className="rounded bg-blue-500 px-2 text-white hover:bg-blue-600"
              >
                Clear All
              </button>
            )}
          </div>
          Resulting in {count !== undefined ? count : "..."} persons.
        </div>

        <Tabs.Group aria-label="Tabs with underline" style="underline">
          <Tabs.Item active title="1-Search for Skills">
            <SkillSearch
              onPillClickSelect={onPillClickSelect}
              allSkills={remainingSkills}
            />
          </Tabs.Item>
          <Tabs.Item title="2-Show Matching Persons">
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <div>
                These are the persons that meet your skill search criteria
              </div>
              <div className="min-w-max flex-shrink-0">
                <Button.Group>
                  <Button
                    color="gray"
                    disabled={selectedPersons.length === 0}
                    onClick={() => setOpenExportModal("dismissible")}
                  >
                    <ArrowDownCircleIcon className="mr-3 h-6 w-6 text-gray-500" />
                    <p>Export</p>
                  </Button>
                  <Button
                    color="gray"
                    disabled={selectedPersons.length === 0}
                    onClick={() => setOpenRFIModal("dismissible")}
                  >
                    <InformationCircleIcon className="mr-3 h-6 w-6 text-gray-500" />
                    <p>Request for Information</p>
                  </Button>
                </Button.Group>
              </div>
            </div>
            {data ? (
              toShow?.length === 0 ? (
                <span>There are no people!</span>
              ) : (
                <div className="relative overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-50 text-xs uppercase dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            <input
                              type="checkbox"
                              checked={selectAllPersons}
                              onChange={handleSelectAllPersons}
                              className={`${
                                isSelectedAllPersonsIndeterminate
                                  ? "bg-blue-200 dark:bg-blue-800"
                                  : ""
                              }`}
                            />
                          </th>
                        </tr>
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
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedPersons.includes(p.id)}
                              onChange={() => handleSelectPerson(p.id)}
                            />
                          </td>
                          <th scope="row" className="px-6 py-4">
                            {/* open in separate tab (to not loose the search context and selection) */}
                            {/* never break line between given name and external link icon */}
                            <Link href={`/persons/${p.id}`} target="_blank">
                              {p.family_name}, {/* prettier-ignore */}
                              <span className="whitespace-nowrap">
                                {p.given_name} <ArrowTopRightOnSquareIcon className="h-4 w-4 inline align-middle -mt-1" />
                              </span>
                            </Link>
                          </th>
                          <td className="px-6 py-4">
                            {p.capabilities.map((c, index) => (
                              // if the skill is also selected, make it bold, but not the separating comma
                              <React.Fragment key={index}>
                                <span
                                  className={`${
                                    selectedSkills.some(
                                      (skill) =>
                                        skill.domain === c.domain &&
                                        skill.name_en === c.name_en,
                                    )
                                      ? "font-bold"
                                      : ""
                                  }`}
                                >
                                  {c.name_en} ({c.self_identified_level})
                                </span>
                                {index !== p.capabilities.length - 1 && ", "}
                              </React.Fragment>
                            ))}
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
                            fillRule="evenodd"
                            d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                            clipRule="evenodd"
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
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
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
      <DummyModal
        title="Export"
        actionButtonText="Export to CSV"
        openModal={openExportModal}
        setOpenModal={setOpenExportModal}
      >
        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
          Here you can export your selected persons to CSV
        </p>
        <pre>
          {/* CSV Headers */}
          {`Family Name, Given Name, Email, ID\n`}
          {/* lookup selectedPersons (id) in toShow array (all fields) */}
          {toShow &&
            toShow
              .filter((person) => selectedPersons.includes(person.id))
              .slice(0, 5)
              .map(
                (person) =>
                  `${person.family_name}, ${
                    person.given_name
                  }, ${decodeURIComponent(person.email)}, ${person.id}\n`,
              )}
          {/* omit the ellipsis if slice was complete */}
          {selectedPersons.length > 5 && "..."}
        </pre>
      </DummyModal>

      <DummyModal
        title="Request For Information"
        actionButtonText="Send Emails"
        openModal={openRFIModal}
        setOpenModal={setOpenRFIModal}
      >
        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
          This is where we would send emails
        </p>
        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
          EMAIL TEMPLATE:
          <br />
          Subject: Request to Update Your Profile
          <br />
          Dear [First Name], We are currently updating our records and would
          like to kindly ask you to update your epicenter profile. Your profile
          information is essential to ensure we have the most accurate and
          up-to-date information.
          <br />
          Thank you for your prompt attention to this matter.
          <br />
          The epicenter team.
        </p>
        <ul>
          {toShow &&
            toShow
              .filter((person) => selectedPersons.includes(person.id))
              .slice(0, 5)
              .map((person) => (
                <li key={person.id}>{decodeURIComponent(person.email)}</li>
              ))}
        </ul>
        {/* omit the ellipsis if slice was complete */}
        {selectedPersons.length > 5 && "..."}
      </DummyModal>
    </>
  );
};

interface DummyModalProps {
  title: string;
  actionButtonText: string;
  openModal?: string;
  setOpenModal: (value: string | undefined) => void;
  children?: ReactNode; // add this line
}

const DummyModal: React.FC<DummyModalProps> = ({
  title,
  actionButtonText,
  openModal,
  setOpenModal,
  children,
}) => {
  return (
    <Modal
      dismissible
      show={openModal === "dismissible"}
      onClose={() => setOpenModal(undefined)}
    >
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">{children}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setOpenModal(undefined)}>
          {actionButtonText}
        </Button>
        <Button color="gray" onClick={() => setOpenModal(undefined)}>
          Dismiss
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SearchPage;
