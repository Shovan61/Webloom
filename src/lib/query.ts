"use server";

import {
  clerkClient,
  currentUser,
  User as AuthUser,
} from "@clerk/nextjs/server";
import { db } from "./db";
import { Agency, Plan, SubAccount, User } from "@/generated/prisma";
import { v4 } from "uuid";

enum Icon {
  settings = "settings",
  chart = "chart",
  calendar = "calendar",
  check = "check",
  chip = "chip",
  compass = "compass",
  database = "database",
  flag = "flag",
  home = "home",
  info = "info",
  link = "link",
  lock = "lock",
  messages = "messages",
  notification = "notification",
  payment = "payment",
  power = "power",
  receipt = "receipt",
  sheild = "sheild",
  star = "star",
  tune = "tune",
  videorecorder = "videorecorder",
  wallet = "wallet",
  warning = "warning",
  headphone = "headphone",
  send = "send",
  pipelines = "pipelines",
  person = "person",
  category = "category",
  contact = "contact",
  clipboardIcon = "clipboardIcon",
}

export const getAuthUserDetails = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not exist");
    }

    const userData = await db.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
      include: {
        Agency: {
          include: {
            SidebarOption: true,
            SubAccount: {
              include: {
                SidebarOption: true,
              },
            },
          },
        },
        Permissions: true,
      },
    });

    return userData;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong! getAuthUserDetails");
  }
};

export const verifyAndAcceptInvitation = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not exist");
    }

    const invitationExists = await db.invitation.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
        status: "PENDING",
      },
    });

    if (invitationExists?.agencyId) {
      const userDetails = await createTeamUser(invitationExists.agencyId, {
        email: invitationExists.email,
        agencyId: invitationExists.agencyId,
        avatarUrl: user.imageUrl,
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        role: invitationExists.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await saveActivityLogsNotification({
        agencyId: invitationExists.agencyId,
        description: `Joined`,
        subaccountId: undefined,
      });

      if (userDetails) {
        const client = await clerkClient();
        await client.users.updateUserMetadata(user.id, {
          privateMetadata: {
            role: userDetails.role || "SUBACCOUNT_USER",
          },
        });

        await db.invitation.delete({
          where: {
            email: userDetails.email,
          },
        });

        return userDetails.agencyId;
      } else {
        return null;
      }
    } else {
      const agency = await db.user.findUnique({
        where: {
          email: user.emailAddresses[0].emailAddress,
        },
      });

      return agency ? agency.agencyId : null;
    }
  } catch (error) {
    throw new Error("Something went wrong! verifyAndAcceptInvitation");
  }
};

export const createTeamUser = async (agencyId: string, user: User) => {
  try {
    if (user.role === "AGENCY_OWNER") {
      return null;
    }

    const response = await db.user.create({ data: { ...user } });

    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong! createTeamUser");
  }
};

export const saveActivityLogsNotification = async ({
  agencyId,
  description,
  subaccountId,
}: {
  agencyId?: string;
  description: string;
  subaccountId?: string;
}) => {
  try {
    const authUser = await currentUser();
    let userData;
    // No authUser Data (When a contact came in)
    if (!authUser) {
      const response = await db.user.findFirst({
        where: {
          Agency: {
            SubAccount: {
              some: {
                id: subaccountId,
              },
            },
          },
        },
      });

      //   if it is found
      if (response) {
        userData = response;
      }
    }
    // it is NOT an Contact | no sub account Id
    else {
      userData = await db.user.findUnique({
        where: {
          email: authUser?.emailAddresses[0].emailAddress,
        },
      });
    }

    if (!userData) {
      throw new Error("Could not find a user in saveActivityLogsNotification");
    }

    let foundAgencyId = agencyId;
    if (!foundAgencyId) {
      if (!subaccountId) {
        throw new Error(
          "At least an agency Id or Subaccount Id must be provided!"
        );
      }

      const response = await db.subAccount.findUnique({
        where: {
          id: subaccountId,
        },
      });

      if (response) {
        foundAgencyId = response.agencyId;
      }
    }

    if (subaccountId) {
      await db.notification.create({
        data: {
          notification: `${userData.name} | ${description}`,
          User: {
            connect: {
              id: userData.id,
            },
          },
          Agency: {
            connect: {
              id: foundAgencyId,
            },
          },

          SubAccount: {
            connect: {
              id: subaccountId,
            },
          },
        },
      });
    } else {
      await db.notification.create({
        data: {
          notification: `${userData.name} | ${description}`,
          User: {
            connect: {
              id: userData.id,
            },
          },
          Agency: {
            connect: {
              id: foundAgencyId,
            },
          },
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong! saveActivityLogsNotification");
  }
};

export const updateAgencyDetails = async (
  agencyId: string,
  agencyDetails: Partial<Agency>
) => {
  try {
    const response = await db.agency.update({
      where: {
        id: agencyId,
      },
      data: { ...agencyDetails },
    });

    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong! updateAgencyGoal");
  }
};

export const deleteAgencyFunction = async (agencyId: string) => {
  try {
    const response = await db.agency.delete({
      where: {
        id: agencyId,
      },
    });

    return { data: response, status: 200 };
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong! updateAgencyGoal");
  }
};

export const initUser = async (newuser: Partial<User>) => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not exist");
    }

    const userData = await db.user.upsert({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
      update: newuser,
      create: {
        id: user.id,
        avatarUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName} ${user.lastName}`,
        role: newuser.role || "SUBACCOUNT_USER",
      },
    });

    const client = await clerkClient();
    await client.users.updateUserMetadata(user.id, {
      privateMetadata: {
        role: newuser.role || "SUBACCOUNT_USER",
      },
    });

    return userData;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong! initUser");
  }
};

export const upsertAgency = async (agency: Agency, price?: Plan) => {
  if (!agency.companyEmail) return null;

  try {
    const agencyDetails = await db.agency.upsert({
      where: {
        id: agency.id,
      },
      update: agency,
      create: {
        users: {
          connect: {
            email: agency.companyEmail,
          },
        },
        ...agency,
        SidebarOption: {
          create: [
            {
              name: "Dashboard",
              icon: Icon.category,
              link: `/agency/${agency.id}`,
            },
            {
              name: "Launchpad",
              icon: Icon.clipboardIcon,
              link: `/agency/${agency.id}/launchpad`,
            },
            {
              name: "Billing",
              icon: Icon.payment,
              link: `/agency/${agency.id}/billing`,
            },
            {
              name: "Settings",
              icon: Icon.settings,
              link: `/agency/${agency.id}/settings`,
            },
            {
              name: "Sub Accounts",
              icon: Icon.person,
              link: `/agency/${agency.id}/all-subaccounts`,
            },
            {
              name: "Team",
              icon: Icon.sheild,
              link: `/agency/${agency.id}/team`,
            },
          ],
        },
      },
    });

    return agencyDetails;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong! upsertAgency");
  }
};

export const getNotificationsAccessAndUser = async (agencyId: string) => {
  try {
    const response = await db.notification.findMany({
      where: {
        agencyId: agencyId,
      },
      include: {
        User: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong! getNotificationsAccessAndUser");
  }
};

export const upsertSubAccount = async (subaccount: SubAccount) => {
  try {
    if (!subaccount.companyEmail)
      throw new Error(
        "Can not upsertSubAccount because no compmany email found!"
      );

    const agencyOwner = await db.user.findFirst({
      where: {
        Agency: {
          id: subaccount.agencyId,
        },
        role: "AGENCY_OWNER",
      },
    });

    if (!agencyOwner)
      throw new Error("no agency owner found!! upsertSubAccount");

    const permissionId = v4();

    const response = await db.subAccount.upsert({
      where: {
        id: subaccount.id,
      },
      update: subaccount,
      create: {
        ...subaccount,
        Permissions: {
          create: {
            access: true,
            email: agencyOwner.email,
            id: permissionId,
          },
          connect: {
            subAccountId: subaccount.id,
            id: permissionId,
          },
        },
        Pipeline: {
          create: { name: "Lead Cycle" },
        },
        SidebarOption: {
          create: [
            {
              name: "Launchpad",
              icon: "clipboardIcon",
              link: `/subaccount/${subaccount.id}/launchpad`,
            },
            {
              name: "Settings",
              icon: "settings",
              link: `/subaccount/${subaccount.id}/settings`,
            },
            {
              name: "Funnels",
              icon: "pipelines",
              link: `/subaccount/${subaccount.id}/funnels`,
            },
            {
              name: "Media",
              icon: "database",
              link: `/subaccount/${subaccount.id}/media`,
            },
            {
              name: "Automations",
              icon: "chip",
              link: `/subaccount/${subaccount.id}/automations`,
            },
            {
              name: "Pipelines",
              icon: "flag",
              link: `/subaccount/${subaccount.id}/pipelines`,
            },
            {
              name: "Contacts",
              icon: "person",
              link: `/subaccount/${subaccount.id}/contacts`,
            },
            {
              name: "Dashboard",
              icon: "category",
              link: `/subaccount/${subaccount.id}`,
            },
          ],
        },
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong! upsertSubAccount");
  }
};

export const deleteSubaccountFunction = async (subAccountId: string) => {
  try {
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong! deleteSubaccountFunction");
  }
};

export const getUserDetailsByAuthEmail = async (authUser: AuthUser) => {
  try {
    const response = await db.user.findUnique({
      where: {
        email: authUser.emailAddresses[0].emailAddress,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong! getUserDetailsByAuthEmail");
  }
};

export const getAgencyDetails = async (agencyId: string) => {
  try {
    const response = await db.agency.findUnique({
      where: { id: agencyId },
      include: {
        SubAccount: true,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong! getAgencyDetails");
  }
};

export const getAgencyInfo = async (agencyId: string)  => {
try {
  const response = await db.agency.findUnique({
    where: {
      id: agencyId
    }
  })
  return response
} catch (error) {
  console.log(error);
    throw new Error("Something went wrong! getAgencyInfo");
}
}

export const getUserPermissions = async (userId: string) => {
  try {
    const response = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        Permissions: {
          include: {
            SubAccount: true,
          },
        },
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong! getUserPermissions");
  }
};

export const updateUser = async (user: Partial<User>) => {
  try {
    const reponse = await db.user.update({
      where: {
        email: user.email,
      },
      data: { ...user },
    });

    return reponse;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong! updateUser");
  }
};

export const changeUserPermission = async (
  permissionId: string,
  userEmail: string,
  subAccountId: string,
  permission: boolean
) => {
  try {
    const response = await db.permissions.upsert({
      where: {
        id: permissionId,
      },
      update: {
        access: permission,
      },
      create: {
        access: permission,
        email: userEmail,
        subAccountId: subAccountId,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong! changeUserPermission");
  }
};
