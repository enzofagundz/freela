const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class PrismaClass {

    async disconnect() {
        await prisma.$disconnect();
    }

    constructor(prisma) {
        this.p = prisma;
    }

    getPrisma() {
        return this.p;
    }
}

module.exports = new PrismaClass(prisma);