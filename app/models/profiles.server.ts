import type { Profile } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getProfile(id: Profile["id"]) {
  return prisma.profile.findFirst({
    where: { id },
    include: {
      server: true,
    },
  });
}

export async function getProfilesForServer(serverId: Profile["serverId"]) {
  return prisma.profile.findMany({
    where: { serverId },
    include: {
      server: true,
    },
  });
}
