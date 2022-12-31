import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { GameMode } from "@prisma/client";

export async function getServersForUser(user: User) {
  return prisma.server.findMany({ where: { owner: user }, include: {
    activeProfile: true
  } });
}

export async function getServer(id: string) {
  return prisma.server.findFirst({ where: { id }, include: {
    activeProfile: true
  }});
}
