import { getAuthUserDetails } from "@/lib/query";
import React from "react";
import MenuOptions from "./menu-options";

type Props = {
  id: string;
  type: "agency" | "subaccount";
};

async function Sidebar({ id, type }: Props) {
  const user = await getAuthUserDetails();
  if (!user) return null;
  if (!user.Agency) return null;

  const details =
    type === "agency"
      ? user.Agency
      : user?.Agency.SubAccount.find((sAcc) => sAcc.id === id);

  const iswhiteLabeledAgency = user.Agency.whiteLabel;

  if (!details) return null;

  let sideBarLogo = user.Agency.agencyLogo;

  if (!iswhiteLabeledAgency) {
    if (type === "subaccount") {
      sideBarLogo =
        user?.Agency.SubAccount.find((sAcc) => sAcc.id === id)
          ?.subAccountLogo || user.Agency.agencyLogo;
    }
  }

  const sideBarOptions =
    type === "agency"
      ? user.Agency.SidebarOption || []
      : user.Agency.SubAccount.find((sAcc) => sAcc.id === id)?.SidebarOption ||
        [];

  const subaccounts = user.Agency.SubAccount.filter((subaccount) =>
    user.Permissions.find(
      (p) => p.subAccountId === subaccount.id && p.access === true
    )
  );

  return (
    <>
      <MenuOptions
        defaultOpen={true}
        details={details}
        id={id}
        sidebarLogo={sideBarLogo}
        sidebarOptions={sideBarOptions}
        subaccounts={subaccounts}
        user={user}
        
      />

      {/* For mobile */}
      <MenuOptions
        details={details}
        id={id}
        sidebarLogo={sideBarLogo}
        sidebarOptions={sideBarOptions}
        subaccounts={subaccounts}
        user={user}

      />
    </>
  );
}

export default Sidebar;
