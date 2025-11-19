/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AgencySidebarOption,
  SubAccount,
  SubAccountSidebarOptions,
} from "@/generated/prisma";
import React from "react";

type Props = {
  defaultOpen?: boolean;
  subaccounts: SubAccount[];
  sidebarOptions: AgencySidebarOption[] | SubAccountSidebarOptions[];
  sidebarLogo: string;
  details: any;
  user: any;
  id: any;
};

function MenuOptions({
  details,
  id,
  sidebarLogo,
  sidebarOptions,
  subaccounts,
  user,
  defaultOpen,
}: Props) {
  return <div>MenuOptions</div>;
}

export default MenuOptions;
