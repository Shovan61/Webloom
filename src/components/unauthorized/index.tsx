import Link from "next/link";

function Unauthorized() {
  return (
    <div className="p-4 text-center h-screen w-screen flex items-center justify-center flex-col">
      <h1 className="text-3xl md:text-6xl"> Unauthorized Access!</h1>
      <p>Please contact support or your agency owner to get access</p>
      <Link href={"/"} className="mt-4 bg-blue-600 p-2">
        {" "}
        Back to home
      </Link>
    </div>
  );
}

export default Unauthorized;
