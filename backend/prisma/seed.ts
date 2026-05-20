import { PrismaService } from '../src/prisma/prisma.service'

const prisma = new PrismaService()

async function main() {
    await prisma.onModuleInit()
    await prisma.role.createMany({
        data: [
            { name: 'ADMIN' },
            { name: 'USER' },
        ],
        skipDuplicates: true,
    
    })

    console.log('Roles creados correctamente')

}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.onModuleDestroy()
    })
