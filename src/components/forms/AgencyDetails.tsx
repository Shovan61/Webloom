"use client";

import { Agency } from "@/generated/prisma";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AgencyFormValues, AgencySchema } from "@/lib/zod-schema/zod-schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

type Props = {
  data?: Partial<Agency>;
};

function AgencyDetails({ data }: Props) {
  const router = useRouter();

  const [deleteAgency, setdeleteAgency] = useState<boolean>(false);

  const form = useForm<AgencyFormValues>({
    mode: "onChange",
    resolver: zodResolver(AgencySchema), // Integrate Zod for schema-based validation
    defaultValues: {
      name: data?.name,
      companyEmail: data?.companyEmail,
      companyPhone: data?.companyPhone,
      whiteLabel: data?.whiteLabel,
      address: data?.address,
      city: data?.city,
      zipCode: data?.zipCode,
      state: data?.state,
      country: data?.country,
      agencyLogo: data?.agencyLogo,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: AgencyFormValues) => {
    console.log("Invoice Data:", data); // Log validated form data to the console
  };

  useEffect(() => {
    if (data) {
      form.reset();
    }
  }, [data]);

  return (
    <AlertDialog>
      <Card className="w-full mt-8">
        <CardHeader>
          <CardTitle className="text-xl">Agency Information</CardTitle>
          <CardDescription>
            <span className="text-xs">
              {" "}
              Fill out Agency information to create one.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="agencyLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Logo</FormLabel>
                    <FormControl>
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-2"></CardFooter>
      </Card>
    </AlertDialog>
  );
}

export default AgencyDetails;
