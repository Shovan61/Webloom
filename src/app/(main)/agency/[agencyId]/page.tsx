import React from "react";

type Props = {
  params: {
    agencyId: string;
  };
};

function Page({ params: { agencyId } }: Props) {
  return <div>{agencyId}</div>;
}

export default Page;
