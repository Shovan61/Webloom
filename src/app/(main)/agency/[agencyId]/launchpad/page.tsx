import Main from "./_components/main";

type Props = {
  params: {
    agencyId: string;
  };
  searchparams: {
    code: string;
  };
};

async function LaunchPadPage({ params, searchparams }: Props) {
  const { agencyId } = await params;

  return <Main agencyId={agencyId} searchparams={searchparams} />;
}

export default LaunchPadPage;
