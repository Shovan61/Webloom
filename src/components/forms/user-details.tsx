"use client";
import { SubAccount, User } from "@/generated/prisma";
import {
  AuthUSerWithAgencySigebarOptionsSubAccounts,
  UserWithPermissionsAndSubAccounts,
} from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useForm } from "react-hook-form";
import {
  UserDetailsFormValues,
  UserDetailsSchema,
} from "@/lib/zod-schema/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import {
  changeUserPermission,
  getAuthUserDetails,
  getUserPermissions,
  saveActivityLogsNotification,
  updateUser,
} from "@/lib/query";
import { Separator } from "../ui/separator";
import { v4 } from "uuid";
import { Switch } from "../ui/switch";

type Props = {
  id: string;
  type?: "agency" | "subaccount";
  userData?: Partial<User>;
  subAccounts?: SubAccount[];
};

function UserDetails({ id, subAccounts, type, userData }: Props) {
  const [subAccountPermissions, setsubAccountPermissions] =
    useState<UserWithPermissionsAndSubAccounts>(null);
  const { setClose, data } = useModal();

  const [roleState, setRoleState] = useState("");
  const [loadingPermission, setloadingPermission] = useState(false);
  const [authUserData, setauthUserData] =
    useState<AuthUSerWithAgencySigebarOptionsSubAccounts | null>(null);
  const router = useRouter();

  const form = useForm<UserDetailsFormValues>({
    resolver: zodResolver(UserDetailsSchema),
    mode: "onChange",
    defaultValues: {
      name: userData?.name ? userData?.name : data?.user?.name,
      email: userData?.email ? userData?.email : data?.user?.email,
      avatarUrl: userData?.avatarUrl
        ? userData?.avatarUrl
        : data?.user?.avatarUrl,
      role: userData?.role ? userData?.role : data?.user?.role,
    },
  });

  const onSubmit = async (values: UserDetailsFormValues) => {
    try {
      if (!id) {
        toast.error("ID not found!");
        return;
      }

      if (userData || data?.user) {
        const updatedUser = await updateUser(values);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong!");
    }
  };

  const fetchDetails = async () => {
    const response = await getAuthUserDetails();
    if (response) setauthUserData(response);
  };

  const handleChangePermission = async (
    subAccountId: string,
    value: boolean,
    permissionId: string | undefined
  ) => {
    if (!data?.user?.email) {
      toast.error("Email Required");
      return;
    }
    try {
      setloadingPermission(true);
      const response = await changeUserPermission(
        permissionId ? permissionId : v4(),
        data?.user?.email,
        subAccountId,
        value
      );
      if (type === "agency") {
        await saveActivityLogsNotification({
          agencyId: authUserData?.Agency?.id,
          description: `Gave ${userData?.name} access to | ${
            subAccountPermissions?.Permissions.find(
              (p) => p.subAccountId === subAccountId
            )?.SubAccount.name
          }`,
          subaccountId: subAccountPermissions?.Permissions.find(
            (p) => p.subAccountId === subAccountId
          )?.SubAccount.id,
        });
      }

      if (response) {
        toast.success("The request was successfully");
        if (subAccountPermissions) {
          setsubAccountPermissions((prev) => {
            if (!prev) return prev;

            return {
              Permissions: prev.Permissions.map((p) => {
                if (p.subAccountId === subAccountId) {
                  return { ...p, access: !p.access };
                }
                return p;
              }),
            };
          });
        }
      } else {
        toast.error("Could not update permissions");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong!");
    }
  };

  const getPermission = async (id: string) => {
    const permission = await getUserPermissions(id);
    setsubAccountPermissions(permission);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDetails();
  }, [data]);

  useEffect(() => {
    if (data.user) {
      form.reset();
    }

    if (userData) {
      form.reset(userData);
    }
  }, [userData, data]);

  useEffect(() => {
    if (!data?.user?.id) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    getPermission(data?.user?.id);
  }, [userData, form]);

  return (
    <Card className="w-full border-none shadow-xl">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>Add or update your information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndPoint="avatar"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage className="text-rose-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Full name</FormLabel>
                  <FormControl>
                    <Input required placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage className="text-rose-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Full name</FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Email"
                      {...field}
                      readOnly={
                        userData?.role === "AGENCY_OWNER" ||
                        form.formState.isSubmitting
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-rose-500" />
                </FormItem>
              )}
            />

            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>User Role</FormLabel>
                  <Select
                    defaultValue={field.value}
                    disabled={field.value === "AGENCY_OWNER"}
                    onValueChange={(value) => {
                      if (
                        value === "SUBACCOUNT_USER" ||
                        value === "SUBACCOUNT_GUEST"
                      ) {
                        setRoleState(
                          "You need to have subaccounts to assign Subaccount access to team members"
                        );
                      } else {
                        setRoleState("");
                      }
                      field.onChange(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black">
                      <SelectItem value={"AGENCY_ADMIN"}>
                        Agency Admin
                      </SelectItem>
                      {(data?.user?.role === "AGENCY_OWNER" ||
                        userData?.role === "AGENCY_OWNER") && (
                        <SelectItem value="AGENCY_OWNER">
                          Agency Owner
                        </SelectItem>
                      )}
                      <SelectItem value="SUBACCOUNT_USER">
                        Sub Account User
                      </SelectItem>
                      <SelectItem value="SUBACCOUNT_GUEST">
                        Sub Account Guest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground">{roleState}</p>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Spinner /> : "Save User Details"}
            </Button>
            {authUserData?.role === "AGENCY_OWNER" && (
              <div>
                <Separator className="my-4" />
                <FormLabel>User Permission</FormLabel>
                <FormDescription className="mb-4">
                  You can give Sub Account access to team member by turning on
                  access control for each Sub Account. This is only visible to
                  agency owners
                </FormDescription>
                <div className="flex flex-col gap-4">
                  {authUserData?.role === "AGENCY_OWNER" && (
                    <div>
                      <Separator className="my-4" />
                      <FormLabel>User Permission</FormLabel>
                      <FormDescription className="mb-4">
                        You can give Sub Account access to team member by
                        turning on access control for each Sub Account. This is
                        only visible to agency owners
                      </FormDescription>
                      <div className="flex flex-col gap-4">
                        {subAccounts?.map((subAccount) => {
                          const subAccountPermissionsDetails =
                            subAccountPermissions?.Permissions.find(
                              (p) => p.subAccountId === subAccount.id
                            );

                          return (
                            <div
                              key={subAccount.id}
                              className="flex items-center justify-between rounded-lg border p-4"
                            >
                              <div>
                                <p>{subAccount.name}</p>
                              </div>
                              <Switch
                                disabled={loadingPermission}
                                checked={subAccountPermissionsDetails?.access}
                                onCheckedChange={(permission) =>
                                  handleChangePermission(
                                    subAccount.id,
                                    permission,
                                    subAccountPermissionsDetails?.id
                                  )
                                }
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default UserDetails;
