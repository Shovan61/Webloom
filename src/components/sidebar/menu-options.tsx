/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Agency,
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
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { ChevronsUpDown, Compass, Menu, PlusCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "../ui/aspect-ratio";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Link from "next/link";
import { useModal } from "@/providers/modal-provider";
import CustomModal from "../global/custom-modal";
import SubaccountDetails from "../forms/sub-account-details";
import { Separator } from "../ui/separator";
import { icons } from "@/lib/constants";

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
  const { setOpen } = useModal();

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
            "bg-[#010203]/80 backdrop-blur-xl fixed top-0  p-6 ",
            defaultOpen
              ? "hidden md:inline-block z-0 w-[300px]"
              : "inline-block md:hidden z-100 w-full"
          )}
        >
          <SheetTitle></SheetTitle>
          <div className="mt-5">
            <AspectRatio ratio={16 / 5}>
              <Image
                src={sidebarLogo}
                alt="sidebar-logo"
                fill
                className="rounded-md object-contain"
              />
            </AspectRatio>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full my-4 flex items-center justify-between py-8"
                >
                  <div className="flex items-center text-left gap-2">
                    <Compass />
                    <div className="flex flex-col">
                      {details.name}
                      <span className="text-gray-500 text-[9px] truncate">
                        {details.address}
                      </span>
                    </div>
                  </div>

                  <div>
                    <ChevronsUpDown size={16} />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="relative z-[9999]! bg-black!">
                {
                  <Command className="rounded-lg  shadow-md ">
                    <CommandInput placeholder="Search Accounts..." />
                    {(user?.role === "AGENCY_OWNER" ||
                      user?.role === "AGENCY_ADMIN") &&
                      user?.Agency && (
                        <CommandGroup heading="Agency">
                          <CommandItem className="my-2 text-gray-400  p-2 rounded-md hover:bg-gray-500 cursor-pointer transition-all">
                            {defaultOpen ? (
                              <Link
                                href={`/agency/${user.Agency.id}`}
                                className="flex gap-4 w-full h-4"
                              >
                                <div className="relative w-60 flex justify-between items-center">
                                  <Image
                                    src={user?.Agency?.agencyLogo}
                                    alt="agency-logo"
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                  <div className="flex flex-col flex-1">
                                    {user?.Agency?.name}
                                  </div>
                                </div>
                              </Link>
                            ) : (
                              <SheetClose asChild>
                                <Link
                                  href={`/agency/${user.Agency.id}`}
                                  className="flex gap-4 w-full h-4"
                                >
                                  <div className="relative w-60 flex justify-between items-center">
                                    <Image
                                      src={user?.Agency?.agencyLogo}
                                      alt="agency-logo"
                                      fill
                                      className="rounded-md object-contain"
                                    />
                                    <div className="flex flex-col flex-1">
                                      {user?.Agency?.name}
                                    </div>
                                  </div>
                                </Link>
                              </SheetClose>
                            )}
                          </CommandItem>
                        </CommandGroup>
                      )}
                    <CommandGroup heading="Accounts">
                      {subaccounts && subaccounts.length ? (
                        subaccounts.map((subAcc) => (
                          <CommandItem
                            key={subAcc.id}
                            className="my-2 text-gray-400  p-2 rounded-md hover:bg-gray-500 cursor-pointer transition-all"
                          >
                            {defaultOpen ? (
                              <Link
                                href={`/subaccount/${subAcc.id}`}
                                className="flex gap-4 w-full h-4"
                              >
                                <div className="relative w-60 flex justify-between items-center">
                                  <Image
                                    src={subAcc.subAccountLogo}
                                    alt="subaccount-logo"
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                  <div className="flex flex-col flex-1">
                                    {subAcc.name}
                                  </div>
                                </div>
                              </Link>
                            ) : (
                              <SheetClose asChild>
                                <Link
                                  href={`/subaccount/${subAcc.id}`}
                                  className="flex gap-4 w-full h-4"
                                >
                                  <div className="relative w-60 flex justify-between items-center">
                                    <Image
                                      src={subAcc.subAccountLogo}
                                      alt="subaccount-logo"
                                      fill
                                      className="rounded-md object-contain"
                                    />
                                    <div className="flex flex-col flex-1">
                                      {subAcc.name}
                                    </div>
                                  </div>
                                </Link>
                              </SheetClose>
                            )}
                          </CommandItem>
                        ))
                      ) : (
                        <span className="text-xs ">No Accounts found</span>
                      )}
                    </CommandGroup>
                  </Command>
                }
                {(user?.role === "AGENCY_ADMIN" ||
                  user?.role === "AGENCY_OWNER") && (
                  <Button
                    className="w-full flex gap-2 mt-3 cursor-pointer"
                    onClick={() => {
                      setOpen(
                        <CustomModal
                          title="Create A Subaccount"
                          subheading="You can switch between your agency account and the subaccount from the sidebar"
                        >
                          <SubaccountDetails
                            agencyDetails={user.Agency as Agency}
                            userId={user.id}
                            userName={user.name}
                            data={user.Agency.SubAccount}
                          />
                        </CustomModal>
                      );
                    }}
                  >
                    <PlusCircleIcon size={15} /> Create Sub-Account
                  </Button>
                )}
              </PopoverContent>
            </Popover>
            <p className="text-gray-600 text-xs mb-2">MENU LINKS</p>
            <Separator className="mb-4" />
            <nav className="relative">
              <Command className="rounded-lg  shadow-md">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup className="overflow-visible">
                    {sidebarOptions.map((sidebarOption) => {
                      let value;
                      const result = icons.find(
                        (cur) => cur.value === sidebarOption.icon
                      );
                      if (result) {
                        value = <result.path />;
                      }
                      return (
                        <CommandItem
                          key={sidebarOption.id}
                          className="w-full hover:bg-blue-500!"
                        >
                          <Link
                            href={sidebarOption.link}
                            className="flex items-center gap-2 hover:bg-transparent rounded-md transition-all md:w-full w-[320px]"
                          >
                            {value}
                            <span>{sidebarOption.name}</span>
                          </Link>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </nav>
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
