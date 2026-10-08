"use client";

import type { ReactNode } from "react";
import { CollabProvider } from "./CollabProvider";
import { AppSync } from "./AppSync";
import { CapacitorInit } from "./CapacitorInit";
import { NativeMode } from "./NativeMode";
import { PwaRegister } from "./PwaRegister";
import { ThemeProvider } from "./ThemeProvider";

export function AppKhachProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <CollabProvider>
        <NativeMode />
        <CapacitorInit />
        <PwaRegister />
        <AppSync />
        {children}
      </CollabProvider>
    </ThemeProvider>
  );
}
