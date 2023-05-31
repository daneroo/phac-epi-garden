import { type org_tiers } from "@phac/db";

export function OrgAsTable({ org_tiers }: { org_tiers: org_tiers[] }) {
  return <div className="relative overflow-x-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">
            Tier Level
          </th>
          <th scope="col" className="px-6 py-3">
            Name
          </th>
        </tr>
      </thead>
      <tbody>
        {org_tiers.map((o) => (
          <tr key={o.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 ">
              {o.tier_level}
            </th>
            <td className="px-6 py-4">
              {o.name_en}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>;
}
