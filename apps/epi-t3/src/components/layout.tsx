import React from "react";

import FlowbiteContext from "../context/flowbite";
// import { useRouter } from 'next/router';
import { SidebarProvider } from "../context/sidebar";
import { Footer } from "./footer";
import { Header } from "./header";

type LayoutProps = {
  children: React.ReactNode;
};

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
const Layout = ({ children }: LayoutProps) => {
  // const router = useRouter();
  // omit header on home page
  const hasHeader = true; //router.pathname !== '/'
  return (
    <>
      <FlowbiteContext>
        <SidebarProvider>
          {hasHeader && <Header />}
          {children}
          <Footer />
        </SidebarProvider>
      </FlowbiteContext>
    </>
  );
};

export default Layout;
