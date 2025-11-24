#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const argv = require('minimist')(process.argv.slice(2));

const prisma = new PrismaClient();

async function main() {
  const email = argv.email || argv.e || process.env.ADMIN_EMAIL;
  const name = argv.name || argv.n || 'Administrator';

  if (!email) {
    console.error('Please provide an email: --email admin@example.com');
    process.exit(1);
  }

  let user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    console.log(`Found user ${email}, updating role to admin`);
    user = await prisma.user.update({ where: { email }, data: { role: 'admin' } });
    console.log('Updated user:', { id: user.id, email: user.email, role: user.role });
  } else {
    const password = argv.password || 'ChangeMe123!';
    const hashed = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: {
        username: email.split('@')[0],
        email,
        password: hashed,
        fullName: name,
        role: 'admin',
      },
    });
    console.log('Created admin user:', { id: user.id, email: user.email });
    console.log(`Default password: ${password} — please change after login`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
