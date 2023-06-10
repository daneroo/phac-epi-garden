import { useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/solid' // or outline
import type { Skill } from "./skills";
import { SkillPillSearchResults } from "./skill-pill";

export interface SkillSearchProps {
  onPillClickSelect: (skill: Skill) => void
  allSkills: Skill[]
}

export function SkillSearch({ onPillClickSelect, allSkills }: SkillSearchProps) {
  const [search, setSearch] = useState("");
  const onSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(evt.target.value);
  };

  return (
    <>
      <p>
        Add some search criteria, by clicking on a Skill.
      </p>
      <p>
        You can refine by searching within the remaining skills below
      </p>
      <form className="flex items-center max-w-lg mb-4">
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
          </div>
          <input
            value={search} // Bind search state to value
            onChange={onSearchChange}
            type="text"
            id="simple-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search"
            required />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setSearch('')}>
            <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
          </div>
        </div>
      </form>
      <div className="relative overflow-x-auto">
        <div className="flex flex-wrap gap-2">
          <SkillPillSearchResults search={search} onClick={onPillClickSelect} allSkills={allSkills}></SkillPillSearchResults>
        </div>
      </div>
    </>
  )
}
