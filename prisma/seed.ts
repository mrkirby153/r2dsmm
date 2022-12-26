import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "r2dsmm@example.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("password", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const server = await prisma.server.create({
    data: {
      name: "My Server",
      ownerId: user.id,
    },
  });

  const profile = await prisma.profile.create({
    data: {
      name: "Default",
      serverId: server.id,
    },
  });

  await prisma.profile.create({
    data: {
      name: "Simulacrum",
      serverId: server.id,
    },
  });

  await prisma.server.update({
    where: {
      id: server.id,
    },
    data: {
      profileId: profile.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
