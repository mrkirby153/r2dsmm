import type { GameMode, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { GameMode } from "@prisma/client";

export async function getServersForUser(user: User) {
  return prisma.server.findMany({
    where: { owner: user },
    include: {
      activeProfile: true,
    },
  });
}

export async function getServer(id: string) {
  return prisma.server.findFirst({
    where: { id },
    include: {
      activeProfile: true,
    },
  });
}

export async function createServer(
  owner: User["id"],
  name: string,
  gameMode: GameMode
) {
  let server = await prisma.server.create({
    data: {
      name: name,
      ownerId: owner,
    },
  });
  const profile = await prisma.profile.create({
    data: {
      name: "Default",
      serverId: server.id,
      gameMode: gameMode,
    },
  });
  server = await prisma.server.update({
    where: {
      id: server.id,
    },
    data: {
      profileId: profile.id,
    },
  });
  return {
    server,
    profile,
  };
}

export async function deleteServer(id: string) {
  return prisma.server.delete({
    where: { id },
  });
}
