import { useEffect, useState } from "react";

import { type org_tiers } from "@phac/db";

interface OrgTierTreeData {
  id: string;
  name: string;
  level: number;
  children?: OrgTierTreeData[];
}

function OrgTierTree({
  data,
  parentLevel,
}: {
  data: OrgTierTreeData[];
  parentLevel: number;
}) {
  return (
    <ul className="">
      {data.map((node) => (
        <OrgTierTreeNode key={node.id} node={node} parentLevel={parentLevel} />
      ))}
    </ul>
  );
}

function OrgTierTreeNode({
  node,
  parentLevel,
}: {
  node: OrgTierTreeData;
  parentLevel: number;
}) {
  const [collapsed, setCollapsed] = useState(parentLevel == 1);
  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  const levelAnomaly = node.level != parentLevel + 1;

  return (
    <li className="ml-4">
      <span onClick={handleToggle}>{collapsed ? "▶" : "▼"}</span> {node.name}
      {levelAnomaly ? (
        <span className="text-red-500">
          {" "}
          level {node.level} parent:{parentLevel}
        </span>
      ) : (
        <span> level {node.level}</span>
      )}
      {!collapsed && node.children && (
        <OrgTierTree data={node.children} parentLevel={node.level} />
      )}
    </li>
  );
}

export function OrgAsTree({ org_tiers }: { org_tiers: org_tiers[] }) {
  // TODO useEffect for treeData
  const [treeData, setTreeData] = useState<OrgTierTreeData[]>([]);

  // const treeData = buildTree(org_tiers, null);
  useEffect(() => {
    const buildTree = (
      items: org_tiers[],
      parentId: string | null,
    ): OrgTierTreeData[] => {
      const nodes: OrgTierTreeData[] = [];

      for (const item of items) {
        if (item.parent_tier === parentId) {
          const children = buildTree(items, item.id);
          const node: OrgTierTreeData = {
            id: item.id,
            name: item.name_en,
            level: item.tier_level,
          };

          if (children.length > 0) {
            node.children = children;
          }

          nodes.push(node);
        }
      }

      return nodes;
    };

    const hierarchicalData = buildTree(org_tiers, null);
    setTreeData(hierarchicalData);
  }, [org_tiers]);

  return (
    <div>
      <h1>Tree View</h1>
      <OrgTierTree data={treeData} parentLevel={0} />
    </div>
  );
}
