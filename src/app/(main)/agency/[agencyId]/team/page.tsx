import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import DataTable from "./data-table";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import SendInvitation from "@/components/forms/send-invitation";

type Props = {
  params: {
    agencyId: string;
  };
};

async function TeamPage({ params }: Props) {
  const { agencyId } = await params;
  const authUser = await currentUser();

  const teamMembers = await db.user.findMany({
    where: {
      Agency: {
        id: agencyId,
      },
    },
    include: {
      Agency: {
        include: {
          SubAccount: true,
        },
      },
      Permissions: {
        include: {
          SubAccount: true,
        },
      },
    },
  });

  if (!authUser) return null;

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: agencyId,
    },
    include: {
      SubAccount: true,
    },
  });

  if (!agencyDetails) return null;

  return  <DataTable
            actionButtonText={
                <>
                    <Plus size={15} />
                    Add
                </>
            }
            modalChildren={<SendInvitation agencyId={agencyDetails.id} />}
            filterValue="name"
            columns={columns}
            data={teamMembers}
        ></DataTable>;
}

export default TeamPage;
