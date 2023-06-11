import { Footer as FlowbiteFooter } from "flowbite-react";

export const Footer = () => {
  return (
    <FlowbiteFooter container>
      <FlowbiteFooter.Copyright
        by="Public Health Agency of Canada"
        href="#"
        year={2023}
      />
      <FlowbiteFooter.LinkGroup>
        <FlowbiteFooter.Link href="#">About</FlowbiteFooter.Link>
        <FlowbiteFooter.Link href="#">Privacy Policy</FlowbiteFooter.Link>
        <FlowbiteFooter.Link href="#">Licensing</FlowbiteFooter.Link>
        <FlowbiteFooter.Link href="#">Contact</FlowbiteFooter.Link>
      </FlowbiteFooter.LinkGroup>
    </FlowbiteFooter>
  );
};
