import React from "react";

type Props = {
  params: { agencyId: string };
};

async function AgencyPage({ params }: Props) {
  const { agencyId } = await params;

  return <div>{agencyId}</div>;
}

export default AgencyPage;
