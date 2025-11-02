import Grid from "@/components/site/grid";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pricingCards } from "@/lib/constants";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Site() {
  return (
    <main>
      <section className="h-full w-full pt-36 relative flex items-center justify-center flex-col">
        {/* Grid */}
        <Grid />
        <p className="text-center font-semibold text-gray-700 text-lg md:text-xl relative z-50 mt-20 select-none!">
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
      <section className="flex justify-center flex-col gap-4 mt-20">
        <h2 className="text-xl md:text-4xl text-center">
          Choose what fits you right
        </h2>
        <p className="text-gray-500 text-center text-xs md:text-lg">
          Best pricing for your needs. <br /> Are you ready to commit as you can
          start for free?
        </p>
        <div className="flex justify-center gap-4 flex-wrap mt-6 mb-2">
          {pricingCards.map((card) => (
            // WIP: Wire up free product from stripe
            <Card
              key={card.priceId}
              className={clsx("w-[300px], flex-col justify-between", {
                "border-2 border-blue-700": card.title === "Unlimited Saas",
              })}
            >
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bold">{card.price}</span>
                <span className=" text-gray-600">/m</span>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <div>
                  {card.features.map((feat) => (
                    <div key={feat} className="flex gap-2 items-center">
                      <Check className="text-gray-600" />
                      <p>{feat}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/agency?plan=${card.priceId}`}
                  className={cn(
                    "w-full text-center bg-primary p-2 rounded-md",
                    card.title === "Unlimited Saas" ? "bg-gray-600! text-white" : ""
                  )}
                >
                  Get Started
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
