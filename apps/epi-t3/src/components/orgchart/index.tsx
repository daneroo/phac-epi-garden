import { useEffect, useMemo, useRef, useState } from "react";
import OrgChartComponent from "@unicef/react-org-chart";
import { Tree, TreeNode, type TreeProps } from "react-organizational-chart";

import { type org_tiers } from ".prisma/client";

type NodeInfo = {
  tradingName: string;
  account: OrgNode[];
  organizationChildRelationship: OrgNode[];
  collapsed: boolean;
};
type OrgNode = org_tiers & NodeInfo;

const useStyles = {
  root: {
    background: "white",
    display: "inline-block",
    borderRadius: 16,
  },
  expand: {
    transform: "rotate(0deg)",
    marginTop: -10,
    marginLeft: "auto",
    //   transition: theme.transitions.create("transform", {
    //     duration: theme.transitions.duration.short
    //   })
    // },
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: "#ECECF4",
  },
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const OrgChart = OrgChartComponent;

export function Organization({
  org,
}: {
  org: OrgNode;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onCollapse?: Function;
  collapsed: boolean;
}) {
  const classes = useStyles;
  // const [anchorEl, setAnchorEl] = useState(null);
  const elem = useRef(null);
  const [highlight] = useState(false);
  // const handleOnCollapse = useCallback(() => {
  //   if (onCollapse) onCollapse(elem);
  //   setHighlight(true);
  //   setTimeout(() => {
  //     setHighlight(false);
  //   }, 1000);
  // }, [onCollapse]);
  // const handleClick = (event: {
  //   currentTarget: React.SetStateAction<null>;
  // }) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };
  const backgroundColor = highlight ? "#ECECF4" : "white";
  return (
    <div
      style={{ ...classes.root, backgroundColor }}
      className="max-w-sm overflow-hidden rounded shadow-lg"
      ref={elem}
    >
      <div className="px-6 py-4">
        <h2 className="mb-2 text-xl font-bold">{org.tradingName}</h2>
        <h3 className="text-base text-gray-700">{org.name_en}</h3>
      </div>
    </div>
  );
}
export function Account({ a }: { a: OrgNode }) {
  const classes = useStyles;
  return (
    <div className="card" style={{ ...classes.root, cursor: "pointer" }}>
      <div className="card_header">
        <h2>{a.tradingName}</h2>
        <h3>{a.name_en}</h3>
      </div>
    </div>
  );
}

export function Node({ o, parent }: { o: OrgNode; parent?: OrgNode }) {
  const [collapsed] = useState(o.collapsed);
  //   const handleCollapse = (elem) => {
  //     setCollapsed(!collapsed);
  //     setTimeout(() => {
  //       window.requestAnimationFrame(() => {
  //         const { x, y, width, height } = elem.current.getBoundingClientRect();
  //         window.scrollTo({
  //           top: window.scrollY + y - height / 2,
  //           left: window.scrollX + x + width / 2 - window.innerWidth / 2,
  //           behavior: "smooth",
  //         });
  //       });
  //     }, 0);
  //   };
  useEffect(() => {
    o.collapsed = collapsed;
  });
  const T = useMemo(
    () =>
      parent
        ? TreeNode
        : (props: JSX.IntrinsicAttributes & TreeProps) => (
          <Tree
            {...props}
            lineWidth={"2px"}
            lineColor={"#bbc"}
            lineBorderRadius={"12px"}
          >
            {props.children}
          </Tree>
        ),
    [parent],
  );
  const childNodes = !collapsed ? (
    <>
      {o.account.map((a: OrgNode, idx: number) => (
        <TreeNode label={<Account a={a} />} key={idx} />
      ))}
      {o.organizationChildRelationship.map((c: OrgNode, idx: number) => (
        <Node key={idx} o={c} parent={o} />
      ))}
    </>
  ) : undefined;
  return (
    <T
      label={
        <Organization
          org={o}
          //   onCollapse={handleCollapse}
          collapsed={collapsed}
        />
      }
    >
      {childNodes}
    </T>
  );
}

export default function Bla() {
  return "test";
}
