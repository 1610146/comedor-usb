"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { status } = useSession();
  return (
    <div className="p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-4">
        <Link className="font-bold text-lg text-blue-700" href={"/"}>
          COMEDOR USB
        </Link>
        {status === "authenticated" && (
          <>
            <Link className="text-gray-800 hover:text-sky-400 transition-colors" href={"/"}>
              Home
            </Link>
            <Link className="text-gray-800 hover:text-sky-400 transition-colors" href={"/profile"}>
              User Profile
            </Link>
            <Link className="text-gray-800 hover:text-sky-400 transition-colors" href={"/admin"}>
              Admin Dashboard
            </Link>
          </>
        )}
      </div>
      {status === "authenticated" ? (
        <button
          onClick={() => signOut()}
          className="bg-slate-900 text-white px-6 py-2 rounded-md"
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={() => signIn("google")}
          className="bg-slate-900 text-white px-6 py-2 rounded-md"
        >
          Sign In
        </button>
      )}
    </div>
  );
}
