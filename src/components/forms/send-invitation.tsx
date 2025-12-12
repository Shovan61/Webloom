"use client";
import { saveActivityLogsNotification, sendInvitation } from "@/lib/query";
import { UserDataSchema, UserDataValues } from "@/lib/zod-schema/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
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

type SendInvitationProps = {
  agencyId: string;
};

function SendInvitation({ agencyId }: SendInvitationProps) {
  const form = useForm<UserDataValues>({
    mode: "onChange",
    resolver: zodResolver(UserDataSchema),
    defaultValues: {
      email: "",
      role: "SUBACCOUNT_USER",
    },
  });

  const onSubmit = async (values: UserDataValues) => {
    try {
      const response = await sendInvitation(
        values.role,
        values.email,
        agencyId
      );

      await saveActivityLogsNotification({
        agencyId,
        description: `Invitation ${response.email}`,
        subaccountId: undefined,
      });

      toast.success("Created and sent invitation");

      form.reset();
    } catch (error) {
      console.log(error);
      toast.error("Could not send invitation");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitation</CardTitle>
        <CardDescription>
          An invitation will be sent to the user. Users who already have an
          invitation sent out to their email, will not receive another
          invitation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User role</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AGENCY_ADMIN">Agency Admin</SelectItem>
                      <SelectItem value="SUBACCOUNT_USER">
                        Sub Account User
                      </SelectItem>
                      <SelectItem value="SUBACCOUNT_GUEST">
                        Sub Account Guest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? <Spinner /> : "Send Invitation"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default SendInvitation;
