const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.deviceAccess.deleteMany().then(() => {
  console.log('All device logs reset');
}).finally(() => {
  prisma.$disconnect();
});
