import { type ReactNode } from "react";
import Sidebar from "~/app/dashboard/sidebar";

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid w-full grid-cols-5 divide-x bg-neutral-100 dark:bg-neutral-800">
      <div className="sticky top-0 col-span-1 self-start">
        <Sidebar />
      </div>
      <div className="col-span-4">
        <div className="flex flex-col gap-4 pt-4 mx-8">
          <p className="text-2xl font-semibold">Dashboard</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
