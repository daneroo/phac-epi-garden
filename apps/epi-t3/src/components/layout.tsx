import React from "react";
import { useRouter } from 'next/router';
import { SidebarProvider } from "../context/sidebar";
import FlowbiteContext from "../context/flowbite";
import Header from "./header";
import { Footer } from "flowbite-react";


const MyFooter = () => {
  return (

    <Footer container>
      <Footer.Copyright
        by="Flowbite™"
        href="#"
        year={2022}
      />
      <Footer.LinkGroup>
        <Footer.Link href="#">
          About
        </Footer.Link>
        <Footer.Link href="#">
          Privacy Policy
        </Footer.Link>
        <Footer.Link href="#">
          Licensing
        </Footer.Link>
        <Footer.Link href="#">
          Contact
        </Footer.Link>
      </Footer.LinkGroup>
    </Footer>
  )
};

type LayoutProps = {
  children: React.ReactNode,
};

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  // omit header on home page
  const hasHeader = true; //router.pathname !== '/'
  return (
    <>
      <FlowbiteContext>
        <SidebarProvider>
          {hasHeader && <Header />}
          {children}
          <MyFooter />
        </SidebarProvider>
      </FlowbiteContext>
    </>
  );
};

export default Layout;
