import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return <ClerkProvider appearance={{ theme: dark }}>{children}</ClerkProvider>;
}

export default Layout;
