"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { Agency, Plan, User } from "@/generated/prisma";

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
    console.log(agencyDetails, "logged");

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
