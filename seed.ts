import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding demo data...')

  // Clear existing data
  await prisma.expense.deleteMany()
  await prisma.prescription.deleteMany()
  await prisma.visit.deleteMany()
  await prisma.patient.deleteMany()

  // Generate 15 Dummy Patients
  const patientsData = [
    { name: 'أحمد محمود', phone: '01012345678', chronicDiseases: 'الضغط', allergies: 'البنسلين' },
    { name: 'سارة خالد', phone: '01123456789', chronicDiseases: null, allergies: null },
    { name: 'محمد علي', phone: '01234567890', chronicDiseases: 'السكري', allergies: null },
    { name: 'فاطمة حسن', phone: '01098765432', chronicDiseases: null, allergies: 'الفول' },
    { name: 'عمر ياسين', phone: '01187654321', chronicDiseases: null, allergies: null },
    { name: 'نور أحمد', phone: '01276543210', chronicDiseases: 'الربو', allergies: null },
    { name: 'محمود طارق', phone: '01511112222', chronicDiseases: null, allergies: null },
    { name: 'هند إبراهيم', phone: '01022223333', chronicDiseases: null, allergies: null },
    { name: 'يوسف جمال', phone: '01133334444', chronicDiseases: null, allergies: null },
    { name: 'ليلى كريم', phone: '01244445555', chronicDiseases: 'حساسية صدر', allergies: null },
    { name: 'عبدالرحمن سالم', phone: '01555556666', chronicDiseases: null, allergies: null },
    { name: 'منى فريد', phone: '01066667777', chronicDiseases: null, allergies: null },
    { name: 'سامر حسن', phone: '01177778888', chronicDiseases: null, allergies: null },
    { name: 'دينا مجدي', phone: '01288889999', chronicDiseases: null, allergies: 'الأسبرين' },
    { name: 'كريم عادل', phone: '01599990000', chronicDiseases: null, allergies: null },
  ];

  const createdPatients = []
  for (const p of patientsData) {
    const patient = await prisma.patient.create({ data: p })
    createdPatients.push(patient)
  }

  // Create Visits for today
  console.log('Creating visits...')
  for (let i = 1; i <= 3; i++) {
    for (const patient of createdPatients) {
      if (Math.random() > 0.5) {
        await prisma.visit.create({
          data: {
            patientId: patient.id,
            queueNumber: i * 10 + patient.id,
            type: 'NEW',
            status: 'COMPLETED',

            diagnosis: 'تشخيص مبدئي',
            amountPaid: 300,
            prescriptions: {
              create: [
                { medicineName: 'Panadol', dose: '1 قرص', duration: '3 أيام' }
              ]
            }
          }
        })
      }
    }
  }

  // Create Users
  console.log('Creating users...')
  await prisma.user.createMany({
    data: [
      { name: 'مدير النظام', phone: '01000000000', role: 'ADMIN', pin: '1234' },
      { name: 'د. أحمد', phone: '01111111111', role: 'DOCTOR', pin: '0000' },
      { name: 'السكرتارية', phone: '01222222222', role: 'SECRETARY', pin: '1111' },
    ]
  })

  // Create Medicines
  console.log('Creating medicines...')
  await prisma.medicine.createMany({
    data: [
      { tradeName: 'Panadol 500mg', activeIngredient: 'Paracetamol', commonDose: 'قرص كل 8 ساعات', contraindications: 'مرضى الكبد' },
      { tradeName: 'Augmentin 1g', activeIngredient: 'Amoxicillin + Clavulanate', commonDose: 'قرص كل 12 ساعة', contraindications: 'حساسية البنسلين' },
      { tradeName: 'Brufen 400mg', activeIngredient: 'Ibuprofen', commonDose: 'قرص بعد الأكل', contraindications: 'قرحة المعدة' },
      { tradeName: 'Congestal', activeIngredient: 'Paracetamol + Chlorpheniramine', commonDose: 'قرص مساءً', contraindications: 'يسبب النعاس' },
      { tradeName: 'Concor 5mg', activeIngredient: 'Bisoprolol', commonDose: 'قرص صباحاً', contraindications: 'الربو' }
    ]
  })

  // Add Expenses
  await prisma.expense.create({
    data: {
      description: 'أدوات نظافة',
      amount: 150.5
    }
  })
  
  await prisma.expense.create({
    data: {
      description: 'ضيافة (قهوة ومياه)',
      amount: 85.0
    }
  })

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
