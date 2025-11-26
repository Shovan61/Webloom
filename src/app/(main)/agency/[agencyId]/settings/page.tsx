import AgencyDetails from "@/components/forms/AgencyDetails";
import UserDetails from "@/components/forms/user-details";
import { getAgencyDetails, getUserDetailsByAuthEmail } from "@/lib/query";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

type Props = {
  params: { agencyId: string };
};

async function SettingsPage({ params }: Props) {
  const { agencyId } = await params;
  const authUser = await currentUser();
  if (!authUser) return null;

  const userDetails = await getUserDetailsByAuthEmail(authUser);

  if (!userDetails) return null;

  const agencyDetails = await getAgencyDetails(agencyId);

  if (!agencyDetails) return null;

  const subAccounts = agencyDetails.SubAccount;

  return (
    <div className="flex md:flex-row flex-col gap-4">
      <AgencyDetails data={agencyDetails} />
      <UserDetails id={authUser.id} subAccounts={subAccounts} />
    </div>
  );
}

export default SettingsPage;
