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
import FileUpload from "../global/file-upload";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Radio } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

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
      <Card className="w-full mt-8 border-0 shadow-xl">
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
                disabled={isLoading}
                control={form.control}
                name="agencyLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Logo</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndPoint="agencylogo"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col md:flex-row gap-4">
                {/* Agency Name */}
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agency Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="New Agency Name"
                          {...field}
                          className="w-xs"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Agency Email */}
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="companyEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agency Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="New Agency Name"
                          {...field}
                          className="w-xs"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Agency Phone */}
              <FormField
                disabled={isLoading}
                control={form.control}
                name="companyPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="New Agency Phone" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* White Label */}
              {/* <FormField
                disabled={isLoading}
                control={form.control}
                name="whiteLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Whitelabel</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id={field.name}
                      />
                    </FormControl>
                    <FormDescription className="w-xl">
                      Turning on Whitelabel mode will show your agency logo to
                      all sub-accounts by default. You can overwrite this
                      functionality through sub-account settings.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                disabled={isLoading}
                control={form.control}
                name="whiteLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Whitelabel</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value ? "true" : "false"} // Set value as 'true' or 'false' based on boolean
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        } // Set 'true' or 'false' based on radio selection
                      >
                        <div className="flex space-x-4">
                          <div>
                            <RadioGroupItem value="true" id="whitelabel-yes" />
                            <label htmlFor="whitelabel-yes">Yes</label>
                          </div>
                          <div>
                            <RadioGroupItem value="false" id="whitelabel-no" />
                            <label htmlFor="whitelabel-no">No</label>
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Turning on Whitelabel mode will show your agency logo to
                      all sub-accounts by default. You can overwrite this
                      functionality through sub-account settings.
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
