import "../styles/globals.css";
import type { AppType } from "next/app";
import type { Session } from "next-auth";
import Head from 'next/head'
import { SessionProvider } from "next-auth/react";
import Layout from "../components/layout";
import { api } from "~/utils/api";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className="antialiased">
        <Head>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#2b5797" />
          <meta name="theme-color" content="#ffffff" />
        </Head>

        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div >
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
