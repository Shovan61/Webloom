import { SubAccount, User } from "@/generated/prisma";
import {
  AuthUSerWithAgencySigebarOptionsSubAccounts,
  UserWithPermissionsAndSubAccounts,
} from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type Props = {
  id: string;
  type?: "agency" | "subaccount";
  userData?: Partial<User>;
  subAccounts?: SubAccount[];
};

function UserDetails({ id, subAccounts, type, userData }: Props) {
  const [subAccountPermissions, setsubAccountPermissions] =
    useState<UserWithPermissionsAndSubAccounts>(null);
  const { setClose, data } = useModal();

  const [roleState, setroleState] = useState("");
  const [loadingPermission, setloadingPermission] = useState(false);
  const [authUserData, setauthUserData] =
    useState<AuthUSerWithAgencySigebarOptionsSubAccounts | null>(null);
  const router = useRouter();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>Add or update your information</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}

export default UserDetails;
