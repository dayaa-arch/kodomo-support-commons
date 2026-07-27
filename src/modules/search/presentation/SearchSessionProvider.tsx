"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { SearchAnswers } from "../domain/search-answers";

interface SearchSessionValue {
  readonly answers: SearchAnswers | null;
  readonly setAnswers: (answers: SearchAnswers) => void;
  readonly clearAnswers: () => void;
}

const SearchSessionContext = createContext<SearchSessionValue | null>(null);

export function SearchSessionProvider({ children }: { readonly children: ReactNode }) {
  const [answers, setAnswers] = useState<SearchAnswers | null>(null);

  const value = useMemo<SearchSessionValue>(
    () => ({
      answers,
      setAnswers,
      clearAnswers: () => setAnswers(null),
    }),
    [answers],
  );

  return (
    <SearchSessionContext.Provider value={value}>
      {children}
    </SearchSessionContext.Provider>
  );
}

export function useSearchSession(): SearchSessionValue {
  const value = useContext(SearchSessionContext);

  if (!value) {
    throw new Error("useSearchSession must be used inside SearchSessionProvider");
  }

  return value;
}
