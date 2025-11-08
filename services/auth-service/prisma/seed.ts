import bcrypt from "bcrypt";

import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();
const saltRounds = 10;
const adminPassword = 'admin';

const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(adminPassword, salt);

async function main() {
  const admin = await prisma.user.upsert({
    where: { login: 'admin' },
    update: {},
    create: {
      login: "admin",
      password: hash,
      role: Role.ADMIN,
    },
  })
  
  console.log({ admin })
}
main()
  .then(async () => {
    await prisma.$disconnect();
    return null;
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
