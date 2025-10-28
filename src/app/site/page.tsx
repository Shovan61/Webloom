import Image from "next/image";

export default function Site() {
  return (
    <main>
      <section className="h-full w-full pt-36 relative flex items-center justify-center flex-col">
        {/* Grid */}
        <div className="absolute h-120 bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <p className="text-center font-semibold text-gray-700 text-xl relative z-50 mt-20 select-none!">
          Run your agency, in one place
        </p>
        <div className="flex gap-1 items-center relative z-50">
          <Image
            src="/icon.png"
            width={80}
            height={80}
            alt="Icon"
            className="mt-2 w-[60px] md:w-20 lg:w-[100px] h-auto select-none!"
          />
          <h1 className="text-4xl md:text-[70px] font-bold text-center bg-gradient-1 select-none!  bg-clip-text text-transparent">
            Webloom
          </h1>
        </div>
        <div className="flex justify-center items-center relative px-5 mb-3">
          <Image
            src="/dummy_dashboard.png"
            width={1200}
            height={200}
            alt="dummy dashboard"
            className="mt-2 rounded-tl-2xl rounded-tr-2xl border-2 border-muted select-none!"
          />
        </div>
      </section>
    </main>
  );
}
