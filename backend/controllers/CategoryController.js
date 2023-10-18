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
        try {
            const categories = await prisma.category.findMany()

            PrismaClass.disconnect()
            if(!categories) {
                return res.status(400).json({ error: 'Error listing categories' })
            }

            return res.status(200).json({ categories })
        } catch (error) {
            console.log(error)
            PrismaClass.disconnect()
            return res.status(500).json({ error: 'Internal server error' })
        }
    }
    
    async getProjectsByCategory(req, res) {
        const { id, userId } = req.params

        try {
            const projects = await prisma.$queryRaw`SELECT * FROM Project
            INNER JOIN UserProjectRelation ON Project.id = UserProjectRelation.projectId
            WHERE UserProjectRelation.userId = ${userId} AND Project.categoryId = ${id}`
            
            PrismaClass.disconnect()

            if(!projects) {
                return res.status(400).json({ error: 'Error listing projects' })
            }

            const projectsWithConvertedPrice = projects.map(project => ({
                ...project,
                price: Number(project.price)
            }));

            return res.status(200).json({ projects: projectsWithConvertedPrice })
        } catch (error) {
            console.log(error)
            PrismaClass.disconnect()
            return res.status(500).json({ error: 'Internal server error' })
        }
    }
}

module.exports = new CategoryController()