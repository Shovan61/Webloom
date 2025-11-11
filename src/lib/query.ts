import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { User } from "@/generated/prisma";
import { use } from "react";
import { connect } from "http2";

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

    if (!invitationExists) {
      throw new Error("Invitation not found!");
    }

    if (invitationExists.agencyId) {
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
    throw new Error("Something went wrong! createTeamUser");
  }
};

export const saveActivityLogsNotification = async ({
  agecyId,
  description,
  subaccountId,
}: {
  agecyId?: string;
  description: string;
  subaccountId?: string;
}) => {
  try {
    const authUser = await currentUser();
    let userData;
    // No user Data (When a contact came in)
    if (!userData) {
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
    // it is NOT an Contact
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

    let foundAgencyId = agecyId;
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
    throw new Error("Something went wrong! saveActivityLogsNotification");
  }
};
