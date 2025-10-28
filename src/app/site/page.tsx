import Image from "next/image";

export default function Site() {
  return (
    <main>
      <section className="h-full w-full pt-36 relative flex items-center justify-center flex-col">
        {/* Grid */}
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <p className="text-center">Run your agency, in one place</p>
        <div className="flex gap-1 items-center">
          <Image
            src="/icon.png"
            width={80}
            height={80}
            alt="Icon"
            className="mt-2 w-[60px] md:w-20 lg:w-[100px] h-auto"
          />
          <h1 className="text-4xl md:text-[70px] font-bold text-center bg-gradient-1  bg-clip-text text-transparent">
            Webloom
          </h1>
        </div>
        <div className="flex justify-center items-center relative px-5">
          <Image
            src="/dummy_dashboard.png"
            width={320}
            height={100}
            alt="dummy dashboard"
            className="mt-2 sm:w-md !md:w-3xl !lg:w-3xl"
          />
        </div>
      </section>
    </main>
  );
}
