import React from "react";

type Props = {
  params: {
    agencyId: string;
  };
};

async function Page({ params }: Props) {
  const { agencyId } = await params;
  return <div>Subaccount Page {agencyId}</div>;
}

export default Page;
