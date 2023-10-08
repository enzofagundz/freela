const { Prisma } = require('@prisma/client')
const PrismaClass = require('../prisma/PrismaClass')
const prisma = PrismaClass.getPrisma()

class ProjectController {
    async store(req, res) {
        const { 
            name,
            description,
            price,
            deliveryDate,
            status,
            userId,
            categories,
            customer
        } = req.body
        
        try {
            const project = await prisma.project.create({
                data: {
                    name,
                    description,
                    price,
                    deliveryDate,
                    status,
                    userId,
                    categories: {
                        connect: categories
                    },
                    customer: {
                        connect: customer
                    }
                },
                include: {
                    categories: true,
                    customer: true
                }
            })

            PrismaClass.disconnect()

            if(!project) {
                return res.status(400).json({ error: 'Error creating project' })
            }

            return res.status(200).json(project)
        } catch (error) {
            PrismaClass.disconnect()
            console.log(error)
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

module.exports = new ProjectController()