import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

async function AgencyPage() {
  const authUser = await currentUser();

  if (!authUser) redirect("/sign-in");

  // Get the User details

  return <div>Agency Dashboard</div>;
}

export default AgencyPage;
