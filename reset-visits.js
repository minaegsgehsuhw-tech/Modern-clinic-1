const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log("Deleting all visits...")
  await prisma.prescription.deleteMany({}) // Must delete child records first
  await prisma.visit.deleteMany({})
  console.log("All visits deleted. Counter is reset to 1.")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
