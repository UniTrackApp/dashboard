import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import { ThemeProvider } from "~/components/theme-provider";
import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <SessionProvider session={session}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Component {...pageProps} />
          <p className="absolute bottom-1 right-1 z-50 rounded-md bg-neutral-200 text-xs">
            This is the old Pages router!
          </p>
        </ThemeProvider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
