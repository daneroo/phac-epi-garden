import React from "react";
import { useRouter } from 'next/router';
import { SidebarProvider } from "../context/sidebar";
import FlowbiteContext from "../context/flowbite";
import { Header } from "./header";
import { Footer } from "./footer";

type LayoutProps = {
  children: React.ReactNode,
};

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  // omit header on home page
  const hasHeader = router.pathname !== '/'
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
