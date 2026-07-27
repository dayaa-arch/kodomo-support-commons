"use client";

import type { ReactNode } from "react";

import { SearchSessionProvider } from "@/src/modules/search";

export function Providers({ children }: { readonly children: ReactNode }) {
  return <SearchSessionProvider>{children}</SearchSessionProvider>;
}
