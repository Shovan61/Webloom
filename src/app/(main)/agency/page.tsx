import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/query";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

async function AgencyPage() {
  const authUser = await currentUser();

  if (!authUser) redirect("/sign-in");

  // if user was sent an invitation
  const agencyId = await verifyAndAcceptInvitation()

  // Get the User details
  const user = await getAuthUserDetails();

  
  return <div>Agency Dashboard</div>;
}

export default AgencyPage;
