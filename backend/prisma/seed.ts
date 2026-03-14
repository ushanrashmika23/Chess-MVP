import { PrismaClient, Role, Difficulty } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const studentPassword = await bcrypt.hash('Student@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'coach@academy.com' },
    update: {},
    create: {
      name: 'Head Coach',
      email: 'coach@academy.com',
      password: adminPassword,
      role: Role.admin,
      lichessUsername: 'lichess'
    }
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@academy.com' },
    update: {},
    create: {
      name: 'Sample Student',
      email: 'student@academy.com',
      password: studentPassword,
      role: Role.student,
      lichessUsername: 'chess-network'
    }
  });

  const puzzle = await prisma.puzzle.create({
    data: {
      title: 'Back Rank Mate in Two',
      description: 'White to move and force mate in two.',
      fenPosition: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1',
      solutionMoves: ['d1d8', 'g8g7', 'd8g8'],
      difficulty: Difficulty.beginner,
      tags: ['mate', 'back-rank'],
      visibility: true,
      createdById: admin.id
    }
  });

  await prisma.puzzleAssignment.upsert({
    where: { puzzleId_studentId: { puzzleId: puzzle.id, studentId: student.id } },
    update: {},
    create: { puzzleId: puzzle.id, studentId: student.id }
  });

  console.log('Seeded admin, student, and sample puzzle.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
