"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Web3Provider } from "@/components/providers/Web3Provider";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Web3Provider>{children}</Web3Provider>
    </SessionProvider>
  );
}
