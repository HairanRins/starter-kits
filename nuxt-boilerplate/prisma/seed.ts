import { PrismaClient, TaskStatus, UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'User',
      email: 'user@example.com',
      password: hashedPassword,
      role: UserRole.USER,
    },
  })

  const tasks = [
    { title: 'Setup project', description: 'Initialize Nuxt 4 project', status: TaskStatus.DONE, userId: admin.id },
    { title: 'Create auth', description: 'Implement JWT authentication', status: TaskStatus.IN_PROGRESS, userId: admin.id },
    { title: 'Build UI', description: 'Create components and pages', status: TaskStatus.TODO, userId: user.id },
    { title: 'Write tests', description: 'Add unit and E2E tests', status: TaskStatus.TODO, userId: user.id },
    { title: 'Deploy', description: 'Deploy to production server', status: TaskStatus.TODO, userId: admin.id },
  ]

  for (const task of tasks) {
    await prisma.task.create({ data: task })
  }

  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
