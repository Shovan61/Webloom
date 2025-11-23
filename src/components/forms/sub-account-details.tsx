"use client";

import { Agency, SubAccount } from "@/generated/prisma";
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
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  SubAccountSchema,
  SubAccountFormValues,
} from "@/lib/zod-schema/zod-schema";
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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { NumberInput } from "@tremor/react";
import {
  deleteSubaccountFunction,
  saveActivityLogsNotification,
  updateAgencyDetails,
  upsertSubAccount,
} from "@/lib/query";
import { Spinner } from "../ui/spinner";
import { v4 } from "uuid";
import { useModal } from "@/providers/modal-provider";

type Props = {
  data?: Partial<SubAccount>;
  agencyDetails: Agency;
  userId: string;
  userName: string;
};

function SubaccountDetails({ data, agencyDetails, userId, userName }: Props) {
  const router = useRouter();
  const { setClose } = useModal();

  const [deleteSubAccount, setDeleteSubaccount] = useState<boolean>(false);

  const form = useForm<SubAccountFormValues>({
    mode: "onChange",
    resolver: zodResolver(SubAccountSchema),
    defaultValues: {
      name: data?.name || "",
      companyEmail: data?.companyEmail || "",
      companyPhone: data?.companyPhone || "",
      address: data?.address || "",
      city: data?.city || "",
      zipCode: data?.zipCode || "",
      state: data?.state || "",
      country: data?.country || "",
      subaccountLogo: data?.subAccountLogo || "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: SubAccountFormValues) => {
    try {
      let customerId;

      if (!data?.id) {
        const bodyData = {
          email: values.companyEmail,
          name: values.name,
          shipping: {
            address: {
              city: values.city,
              country: values.country,
              line1: values.address,
              postal_code: values.zipCode,
              state: values.state,
            },
            name: values.name,
          },
          address: {
            city: values.city,
            country: values.country,
            line1: values.address,
            postal_code: values.zipCode,
            state: values.state,
          },
        };

        const response = await upsertSubAccount({
          id: data?.id ? data?.id : v4(),
          address: values.address,
          city: values.city,
          subAccountLogo: values?.subaccountLogo,
          companyEmail: values.companyEmail,
          companyPhone: values.companyPhone,
          connectAccountId: "",
          country: values.country,
          createdAt: new Date(),
          updatedAt: new Date(),
          goal: 5000,
          name: values.name,
          state: values.state,
          agencyId: agencyDetails.id,
          zipCode: values.zipCode,
        });

        if (data?.id) return router.refresh();
        if (response) {
          toast.success("Created Sub Agency successfully!");
          console.log(response, "=====response=====");
          await saveActivityLogsNotification({
            agencyId: response.agencyId,
            description: `${userName} | updated sub account | ${response.name}`,
            subaccountId: response.id,
          });
          setClose();
          return router.refresh();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong!");
    }
  };

  const handleDelete = async () => {
    if (!data?.id) {
      return;
    }
    setDeleteSubaccount(true);
    // WIP: discontinue the subscription
    try {
      const response = await deleteSubaccountFunction(data.id);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong!");
    } finally {
      setDeleteSubaccount(false);
    }
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
          <CardTitle className="text-xl">Subaccount Information</CardTitle>
          <CardDescription>
            <span className="text-xs">
              Fill out Subaccount information to create one.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="subaccountLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub Account Logo</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndPoint="subaccountLogo"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage className="text-rose-500" />
                  </FormItem>
                )}
              />
              <div className="flex flex-col md:flex-row gap-4">
                {/* Subaccount Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subaccount Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="New Agency Name"
                          {...field}
                          className="w-xs"
                        />
                      </FormControl>

                      <FormMessage className="text-rose-500" />
                    </FormItem>
                  )}
                />
                {/* Subaccount Email */}
                <FormField
                  control={form.control}
                  name="companyEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subaccount Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="New Agency Name"
                          {...field}
                          className="w-xs"
                        />
                      </FormControl>

                      <FormMessage className="text-rose-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Subaccount Phone */}
              <FormField
                control={form.control}
                name="companyPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subaccount Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="New Agency Phone" {...field} />
                    </FormControl>

                    <FormMessage className="text-rose-500" />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>

                    <FormMessage className="text-rose-500" />
                  </FormItem>
                )}
              />

              <div className="flex flex-col md:flex-row gap-2 justify-between">
                {/* City */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>

                      <FormMessage className="text-rose-500" />
                    </FormItem>
                  )}
                />
                {/* State */}
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter state" {...field} />
                      </FormControl>

                      <FormMessage className="text-rose-500" />
                    </FormItem>
                  )}
                />
                {/* Zipcode */}
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip-code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter zipcode" {...field} />
                      </FormControl>

                      <FormMessage className="text-rose-500" />
                    </FormItem>
                  )}
                />
              </div>
              {/* Country */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter country" {...field} />
                    </FormControl>

                    <FormMessage className="text-rose-500" />
                  </FormItem>
                )}
              />
              {/* For Set Goal if a agency exist */}
              {data?.id && (
                <div className="flex flex-col gap-2">
                  <FormLabel>Create A Goal</FormLabel>
                  <FormDescription>
                    Create a goal for your agency. As your business grows your
                    goals grow too so dont forget to set the bar higher
                  </FormDescription>
                  <NumberInput
                    defaultValue={data?.goal}
                    onValueChange={async (value) => {
                      if (data?.id) {
                        await updateAgencyDetails(data?.id, { goal: value });
                        await saveActivityLogsNotification({
                          agencyId: data.id,
                          description: `Updated the agency goal to | ${value} Sub-accounts`,
                          subaccountId: undefined,
                        });

                        router.refresh();
                      }
                    }}
                    min={1}
                    className=""
                    placeholder="Sub-account goal"
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer hover:bg-blue-700 transition-all"
              >
                {isLoading && <Spinner />}
                Save Subaccount Information
              </Button>
            </form>
          </Form>
          {data?.id && (
            <div>
              <div className="flex flex-row items-center  justify-between rounded-lg border border-rose-500 gap-4 p-4 m-4">
                <div>
                  <div>Danger Zone</div>
                </div>
                <div className="text-gray-600 text-sm">
                  Deleting your agency cannot be undone. This will also delete
                  all sub-accounts and all data related to your sub-account.
                  Sub-accounts will no longer have access to funnels, contacts
                  etc.
                </div>
              </div>
              <AlertDialogTrigger
                disabled={isLoading || deleteSubAccount}
                className="text-rose-500 cursor-pointer p-2 text-center mt-2 rounded-md hover:bg-rose-600 hover:text-white whitespace-nowrap"
              >
                {deleteSubAccount ? <Spinner /> : "Delete"}
              </AlertDialogTrigger>
            </div>
          )}

          <AlertDialogContent className="bg-black">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </CardContent>
        <CardFooter className="flex-col gap-2"></CardFooter>
      </Card>
    </AlertDialog>
  );
}

export default SubaccountDetails;
