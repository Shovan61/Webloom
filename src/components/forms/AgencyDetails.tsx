"use client";

import { Agency } from "@/generated/prisma";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  data?: Partial<Agency>;
};

function AgencyDetails({ data: { companyEmail } }: Props) {
  const router = useRouter();

  const [deleteAgency, setdeleteAgency] = useState<boolean>(false);

  return (
    <AlertDialog>
      <Card className="w-full mt-8">
        <CardHeader>
          <CardTitle className="text-xl">Agency Information</CardTitle>
          <CardDescription>
            <span className="text-xs"> Fill out Agency information to create one.</span>
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter className="flex-col gap-2"></CardFooter>
      </Card>
    </AlertDialog>
  );
}

export default AgencyDetails;
