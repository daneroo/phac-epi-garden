import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { Tabs } from "flowbite-react";

import {
  SkillPills,
  SkillSearch,
  skills,
  type Skill,
} from "~/components/taxonomy";

const SearchPage: NextPage = () => {
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

  const onPillClickSelect = (skill: Skill) => {
    // You may want to prevent the same skill from being added multiple times
    if (
      !selectedSkills.find(
        (s) => s.domain === skill.domain && s.name_en === skill.name_en,
      )
    ) {
      setSelectedSkills([...selectedSkills, skill]);
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

  return (
    <>
      <Head>
        <title>Taxonomy - Epicenter</title>
        <meta name="description" content="Taxonomy - Epicenter" />
      </Head>
      <main className="mx-auto max-w-3xl px-4 pb-4 md:max-w-5xl">
        <h2 className="my-4 text-2xl font-extrabold">Taxonomy Search</h2>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            Searching for:{" "}
            <SkillPills
              skills={selectedSkills}
              onClick={onPillClickRemove}
              emptyMessage="Anoyone! Add some criteria to refine."
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
        </div>

        <Tabs.Group aria-label="Tabs with underline" style="underline">
          <Tabs.Item active title="Search for Skills">
            <SkillSearch
              onPillClickSelect={onPillClickSelect}
              allSkills={remainingSkills}
            />
          </Tabs.Item>
          <Tabs.Item title="Select Persons"></Tabs.Item>
          <Tabs.Item title="Perform an Action">
            <ul>
              <li>Print report</li>
              <li>Send some emails</li>
            </ul>
          </Tabs.Item>
        </Tabs.Group>
      </main>
    </>
  );
};

export default SearchPage;
