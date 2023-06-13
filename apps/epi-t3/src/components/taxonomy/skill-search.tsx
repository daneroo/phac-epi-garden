import { useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";

import { SkillPillSearchResults } from "./skill-pill";
// or outline
import type { Skill } from "./skills";

export interface SkillSearchProps {
  onPillClickSelect: (skill: Skill) => void;
  allSkills: Skill[];
}

export function SkillSearch({
  onPillClickSelect,
  allSkills,
}: SkillSearchProps) {
  const [search, setSearch] = useState("");
  const onSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(evt.target.value);
  };

  return (
    <>
      <p className="pb-2">
        Add some search criteria (above), by clicking on a skill below.
      </p>
      <p>
        You can refine your choices by searching within the remaining skills
        below
      </p>
      <form className="mb-4 flex max-w-lg items-center">
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
            />
          </div>
          <input
            value={search} // Bind search state to value
            onChange={onSearchChange}
            type="text"
            id="simple-search"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 pr-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Search within remaining skills"
            required
          />
          <div
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
            onClick={() => setSearch("")}
          >
            <XMarkIcon
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
            />
          </div>
        </div>
      </form>
      <div className="relative overflow-x-auto">
        <div className="flex flex-wrap gap-2">
          <SkillPillSearchResults
            search={search}
            onClick={onPillClickSelect}
            allSkills={allSkills}
          ></SkillPillSearchResults>
        </div>
      </div>
    </>
  );
}
