import {
  skills, getSkillCount, domainCodes, hslColorForDomain, type SkillDomains
} from "~/components/taxonomy";


interface SkillPillSearchResultsProps {
  search: string // 👈️ marked optional, but defaults to empty string
  allSkills: {
    domain: SkillDomains
    name_en: string
  }[]
}

// export function LogoVariant({ variant = "pulsing", }: LogoVariantProps) {

// return an inline *spans* representing search result
export const SkillPillSearchResults = ({ search = "epi", allSkills = skills }: SkillPillSearchResultsProps) => {
  // Filter the skill {domains,name_en}, and levels based on the search term
  const filteredSkills = allSkills.filter(({ domain, name_en }) =>
    domain.toLowerCase().includes(search.toLowerCase()) ||
    name_en.toLowerCase().includes(search.toLowerCase())
  );

  if (filteredSkills.length === 0) {
    return <span>No skills found!</span>
  }

  // wrapping in <>{xx.map()}</> produced the proper result type
  // (as opposed to just returm xx.map())
  return (
    <>
      {filteredSkills.map(({ domain, name_en }, i) => (
        SkillPill(i, domain, name_en)
      ))})
    </>
  )
}


function SkillPill(i: number, domain: SkillDomains, name_en: string) {
  return <span
    key={i}
    className="flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full gap-1"
  >
    <span
      style={{ backgroundColor: hslColorForDomain(domain) }}
      className="w-2 h-2 rounded-full"></span>
    <span
      className="text-[10px]">{domainCodes[domain]}</span>
    <span className="px-1">{name_en}</span>
    <span className="text-[10px] text-gray-600 dark:text-gray-400">
      {getSkillCount(domain, name_en)}
    </span>
  </span>;
}
// export const SkillPill = () => {
//   return (
//     {
//       filteredSkills.map(({ domain, name_en }, i) => (
//         <span
//           key={i}
//           className="flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full gap-1"
//         >
//           <span
//             style={{ backgroundColor: hslColorForDomain(domain) }}
//             className="w-2 h-2 rounded-full"></span>
//           <span
//             className="text-[10px]">{domainCodes[domain]}</span>
//           <span className="px-1">{name_en}</span>
//           <span className="text-[10px] text-gray-600 dark:text-gray-400">
//             {getSkillCount(domain, name_en)}
//           </span>
//         </span>
//       ))
//     }
//   )