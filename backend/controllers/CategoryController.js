const { Prisma } = require('@prisma/client')
const PrismaClass = require('../prisma/PrismaClass')
const prisma = PrismaClass.getPrisma()

class CategoryController {
    async store(req, res) {
        const { name } = req.body

        try {
            const category = await prisma.category.create({
                data: {
                    name
                }
            })

            PrismaClass.disconnect()
            if(!category) {
                return res.status(400).json({ error: 'Error creating category' })
            }

            return res.status(200).json({ category })
        } catch (error) {
            console.log(error)
            PrismaClass.disconnect()
            return res.status(500).json({ error: 'Internal server error' })
        }
    }

    async index(req, res) {
    }

    async show(req, res) {
    }

    async update(req, res) {
    }

    async destroy(req, res) {
    }
}

module.exports = new CategoryController()