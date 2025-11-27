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
import { getAuthUserDetails, updateUser } from "@/lib/query";

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

  const handleChangePermission = async () => {
    try {
    } catch (error) {}
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
                <FormItem className="flex-1 w-full" >
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
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Spinner /> : "Save User Details"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default UserDetails;
