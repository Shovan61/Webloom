/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  AgencySidebarOption,
  SubAccount,
  SubAccountSidebarOptions,
} from "@/generated/prisma";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "../ui/aspect-ratio";

type Props = {
  defaultOpen?: boolean;
  subaccounts: SubAccount[];
  sidebarOptions: AgencySidebarOption[] | SubAccountSidebarOptions[];
  sidebarLogo: string;
  details: any;
  user: any;
  id: any;
};

function MenuOptions({
  details,
  id,
  sidebarLogo,
  sidebarOptions,
  subaccounts,
  user,
  defaultOpen,
}: Props) {
  const openState = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  );

  const [isMounted, setisMounted] = useState<boolean>(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setisMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Sheet modal={false} {...openState}>
        <SheetTrigger
          asChild
          className="absolute left-4 top-4 z-100 md:hidden flex"
        >
          <Button variant="outline" size={"icon"} className="cursor-pointer">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          showX={!defaultOpen}
          className={cn(
            "bg-[#010203]/80 backdrop-blur-xl fixed top-0 border-r p-6 ",
            defaultOpen
              ? "hidden md:inline-block z-0 w-[300px]"
              : "inline-block md:hidden z-100 w-full"
          )}
        >
          <div className="mt-5">
            <AspectRatio ratio={16 / 5}>
              <Image
                src={sidebarLogo}
                alt="sidebar-logo"
                fill
                className="rounded-md object-contain"
              />
            </AspectRatio>
            trst
          </div>

          <SheetFooter>
            <SheetClose asChild></SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default MenuOptions;
