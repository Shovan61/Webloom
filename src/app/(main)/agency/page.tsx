import AgencyDetails from "@/components/forms/AgencyDetails";
import { Plan } from "@/generated/prisma";
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/query";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Code here for stripe confiramtion
//  state has the id for stripe

interface AgencyPageProps {
  searchParams: {
    plan: Plan;
    state: string;
    code: string;
  };
}

async function AgencyPage({ searchParams }: AgencyPageProps) {
  const authUser = await currentUser();

  if (!authUser) redirect("/sign-in");

  // if user was sent an invitation
  const agencyId = await verifyAndAcceptInvitation();

  // Get the User details
  const user = await getAuthUserDetails();

  if (agencyId) {
    if (user?.role === "SUBACCOUNT_GUEST" || user?.role === "SUBACCOUNT_USER") {
      return redirect("/subaccount");
    } else if (user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") {
      if (searchParams.plan) {
        return redirect(`/agency/${agencyId}/billing/${searchParams.plan}`);
      }
      if (searchParams.state) {
        const statePath = searchParams.state.split("__")[0];
        const stateAgencyId = searchParams.state.split("___")[1];
        if (!stateAgencyId) {
          return <div>Not Authorized</div>;
        }
        return redirect(
          `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`
        );
      } else {
        return redirect(`/agency/${agencyId}`);
      }
    } else {
      return <div>Not Authorized</div>;
    }
  }

  return (
    <div className="flex justify-center items-center mt-4">
      <div className="max-w-[850px] border-0 p-4 rounded-xl">
        <h1 className="text-4xl">Create An Agency</h1>
        <AgencyDetails
          data={{ companyEmail: authUser?.emailAddresses[0].emailAddress }}
        />
      </div>
    </div>
  );
}

export default AgencyPage;
