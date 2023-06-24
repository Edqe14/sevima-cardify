/* eslint-disable no-console */
import { prisma } from '@/lib/prisma';

const main = async () => {
  // Seeder
};

main()
  .then(async () => {
    console.log('Seeder finished.');
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
