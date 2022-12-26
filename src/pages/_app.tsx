import "@styles/globals.css";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { trpc } from "@utils/trpc";
import { AlertsProvider } from "@context/AlertsContext";
import BaseNavBar from "@components/NavBar/NavBar";
import Footer from "@components/Footer";
import React from "react";
import Alerts from "@components/Alerts";

export const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main>
        <AlertsProvider>
          <BaseNavBar />
          <Alerts />
          <div className="my-12 flex-grow">
            <Component {...pageProps} />
          </div>
          <Footer />
        </AlertsProvider>
      </main>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
