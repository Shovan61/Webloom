import { UserButton } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "../mood-toogle/MoodToggle";

type Props = {
  user?: null | User;
};

function Navigation({}: Props) {
  return (
    <div className="p-4 flex items-center justify-between relative">
      <aside className="flex items-center gap-2">
        <Image
          src="/webloom_light.png"
          width={80}
          height={80}
          alt="Icon"
          className="mt-2 w-[60px] md:w-20 lg:w-[100px] h-auto select-none!"
        />
      </aside>
      <nav className="hidden md:block absolute left-[50%] to-50% transform translate-x-[-50%] translate-y-[-50%]">
        <ul className="flex items-center justify-center gap-8 select-none!">
          <Link href={"#"} className="font-semibold  text-blue-700">
            Pricing
          </Link>
          <Link href={"#"} className="font-semibold text-blue-700">
            About
          </Link>
          <Link href={"#"} className="font-semibold text-blue-700">
            Documentation
          </Link>
          <Link href={"#"} className="font-semibold text-blue-700">
            Features
          </Link>
        </ul>
      </nav>
      <aside className="flex gap-2 items-center">
        <Link
          href={"/agency"}
          className="font-semibold bg-blue-700 text-white p-2 px-4 rounded-md hover:bg-blue-800  transition-colors"
        >
          Login
        </Link>
        <UserButton />
        <ModeToggle />
      </aside>
    </div>
  );
}

export default Navigation;
