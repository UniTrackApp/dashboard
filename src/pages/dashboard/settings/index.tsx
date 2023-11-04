import Link from "next/link";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next/types";
import React from "react";
import Sidebar from "~/components/(dashboard)/sidebar";
import { getServerAuthSession } from "~/server/auth";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(ctx);

  return {
    props: {
      sessionData: session,
    },
  };
};

export default function Settings({
  sessionData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex flex-row">
      {/* Sidebar */}
      <Sidebar sessionData={sessionData} />

      {/* Main Content */}
      <div className="container mt-8">
        <Link href="/dashboard" className="text-3xl font-bold">
          Settings Page
        </Link>
      </div>
    </div>
  );
}
