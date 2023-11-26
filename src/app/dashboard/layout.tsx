import { type ReactNode } from "react";
import Sidebar from "~/app/dashboard/sidebar";
import MobileNavBar from "~/components/mobile-navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-screen flex">
      <div className="fixed hidden w-[275px] shrink-0 md:block">
        <Sidebar />
      </div>
      <div className="absolute right-0 top-0 md:hidden">
        <MobileNavBar />
      </div>
      <div className="ml-[275px] flex-1 overflow-auto h-screen">
        <div className="mx-8 flex flex-col pt-4">
          {children}
        </div>
      </div>
    </div>
  );
}
