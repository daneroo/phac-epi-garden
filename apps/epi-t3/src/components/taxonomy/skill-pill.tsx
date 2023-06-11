import {
  domainCodes,
  getSkillCount,
  hslColorForDomain,
  type Skill,
} from "~/components/taxonomy";

interface SkillPillSearchResultsProps {
  search: string; // 👈️ marked not optional, but defaults to empty string
  allSkills: Skill[];
  onClick: (skill: Skill) => void; // adding onClick handler prop for pills
}

// export function LogoVariant({ variant = "pulsing", }: LogoVariantProps) {

// return inline *spans* representing search result
export const SkillPillSearchResults = ({
  search,
  allSkills,
  onClick,
}: SkillPillSearchResultsProps) => {
  // Filter the skill {domains,name_en}, and levels based on the search term
  const filteredSkills = allSkills.filter(
    ({ domain, name_en }) =>
      domain.toLowerCase().includes(search.toLowerCase()) ||
      name_en.toLowerCase().includes(search.toLowerCase()),
  );

  if (filteredSkills.length === 0) {
    return <span>No skills found!</span>;
  }

  // wrapping in <>{xx.map()}</> produced the proper result type
  // (as opposed to just return xx.map())
  return (
    <>
      <SkillPills skills={filteredSkills} onClick={onClick}></SkillPills>
    </>
  );
};

interface SkillPillsProps {
  skills: Skill[];
  onClick: (skill: Skill) => void; // adding onClick handler prop for pills
  emptyMessage?: string;
}

export const SkillPills = ({
  skills,
  onClick,
  emptyMessage = "No skills found!",
}: SkillPillsProps) => {
  if (skills.length === 0) {
    return <span>{emptyMessage}</span>;
  }

  // wrapping in <>{xx.map()}</> produced the proper result type
  // (as opposed to just return xx.map())
  return (
    <>
      {skills.map((skill, i) => (
        <SkillPill key={i} skill={skill} onClick={onClick} />
      ))}
    </>
  );
};

interface SkillPillProps {
  skill: Skill;
  onClick: (skill: Skill) => void; // adding onClick handler prop
}

// currently gets it's count from our static data structures
function SkillPill({ skill, onClick }: SkillPillProps) {
  const { domain, name_en } = skill;

  return (
    <span
      onClick={() => onClick(skill)} // adding onClick handler to span
      className="flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    >
      <span
        style={{ backgroundColor: hslColorForDomain(domain) }}
        className="h-2 w-2 rounded-full"
      ></span>
      <span className="text-[10px]">{domainCodes[domain]}</span>
      <span className="px-1">{name_en}</span>
      <span className="text-[10px] text-gray-600 dark:text-gray-400">
        {getSkillCount(domain, name_en)}
      </span>
    </span>
  );
}
