import { UserDataSchema, UserDataValues } from "@/lib/zod-schema/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

type SendInvitationProps = {
  agencyId: string;
};

function SendInvitation({ agencyId }: SendInvitationProps) {
  const form = useForm<UserDataValues>({
    mode: "onChange",
    resolver: zodResolver(UserDataSchema),
    defaultValues: {
      email: "",
      role: "SUBACCOUNT_USER",
    },
  });

  

  return <div>SendInvitation</div>;
}

export default SendInvitation;
