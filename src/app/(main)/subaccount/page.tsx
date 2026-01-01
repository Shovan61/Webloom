import Unauthorized from "@/components/unauthorized";
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/query";
import { redirect } from "next/navigation";


type Props = {
  searchParams: {
    state: string;
    code: string;
  };
};

async function SubaccountMainPage({ searchParams }: Props) {
  const { code, state } = await searchParams;
  const agencyId = await verifyAndAcceptInvitation();

  if (!agencyId) {
    return <Unauthorized />;
  }

  const user = await getAuthUserDetails();

  if (!user) {
    return null;
  }

  const getFirstSubAccountWithAccess = user.Permissions.find(
    (p) => p.access === true
  );

  if (state) {
    const statePath = state.split("__")[0];
    const stateSubAccountId = state.split("__")[1];
    if (!stateSubAccountId) return <Unauthorized />;

    return redirect(
      `/subaccount/${stateSubAccountId}/${statePath}?code=${code}`
    );
  }

  if (getFirstSubAccountWithAccess) {
    return redirect(`/subaccount/${getFirstSubAccountWithAccess.subAccountId}`);
  }
  
  return <Unauthorized />;
}

export default SubaccountMainPage;
