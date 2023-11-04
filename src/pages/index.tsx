import Image from "next/image";
import Link from "next/link";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next/types";

import { getServerSession, type Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button, buttonVariants } from "~/components/ui/button";
import { authOptions } from "~/server/auth";
import { inter } from "~/styles/fonts";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {
      sessionData: session,
    },
  };
};

export default function Home({
  sessionData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <main
        className={`${inter.className} flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-neutral-950 to-neutral-900 text-white antialiased selection:bg-violet-600 selection:text-white`}
      >
        <Navbar sessionData={sessionData} />
        <div className="container flex w-full flex-col items-center justify-center gap-12">
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-3xl font-extrabold tracking-tight sm:text-7xl">
              Welcome to UniTrack
            </h1>
            <p className="text-center text-lg text-neutral-300 sm:text-xl">
              An open-source student monitoring system for modern universities.
            </p>
          </div>

          <Link href="/dashboard" className={`${buttonVariants()} gap-2`}>
            View Dashboard
            <ArrowRight size={16} />
          </Link>
        </div>
        <Footer />
      </main>
    </>
  );
}

function Navbar({ sessionData }: { sessionData: Session | null }) {
  return (
    <>
      <nav className="flex w-full justify-between p-6">
        <Image
          src={"/logo.png"}
          width={40}
          height={40}
          className=""
          alt="UniTrack Logo"
        />

        {/* WHEN SIGNED OUT */}
        {!sessionData && (
          <Button variant={"secondary"} onClick={() => signIn("github")}>
            Sign in
          </Button>
        )}

        {/* WHEN SIGNED IN */}
        {sessionData && (
          <div className="flex flex-row gap-4">
            <div className="flex flex-col">
              {sessionData && (
                <span className="text-md">Hi, {sessionData.user?.name}</span>
              )}

              <Button
                className="h-4 text-sm text-neutral-500"
                variant={"link"}
                size={"sm"}
                onClick={() => signOut()}
              >
                Sign out
              </Button>
            </div>

            {sessionData?.user.image && (
              <Avatar>
                <AvatarImage src={sessionData?.user?.image} />
                <AvatarFallback>DP</AvatarFallback>
              </Avatar>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

function Footer() {
  return (
    <>
      <footer className="mb-4 text-neutral-300">
        Built with &lt;3 by{" "}
        <Link
          referrerPolicy="no-referrer"
          target="_blank"
          className="underline-offset-4 hover:underline"
          href="https://github.com/aryanprince"
        >
          Aryan
        </Link>
        {", "}
        <Link
          referrerPolicy="no-referrer"
          target="_blank"
          className="underline-offset-4 hover:underline"
          href="https://github.com/aryanprince"
        >
          Andrea
        </Link>
        {" and "}
        <Link
          referrerPolicy="no-referrer"
          target="_blank"
          className="underline-offset-4 hover:underline"
          href="https://github.com/aryanprince"
        >
          Lewis
        </Link>
      </footer>
    </>
  );
}

// // Unused function, part of the NextAuth.js showcase
// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.post.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined },
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       {sessionData?.user.image && (
//         <Avatar>
//           <AvatarImage src={sessionData?.user?.image} />
//           <AvatarFallback>DP</AvatarFallback>
//         </Avatar>
//       )}
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// }

// // Test function used to test the Flask API integration
// function FlaskTest() {
//   type MessageFromFlask = {
//     message: string;
//   };

//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const apiUrl = "http://127.0.0.1:5000/message";

//     fetch(apiUrl)
//       .then((response) => response.json())
//       .then((data: MessageFromFlask) => {
//         console.log("Data from API:", data);
//         setMessage(data.message);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//       });
//   }, []);

//   return (
//     <>
//       <p>Current message: {message}</p>
//     </>
//   );
// }
