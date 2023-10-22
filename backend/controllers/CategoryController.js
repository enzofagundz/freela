const { Prisma } = require('@prisma/client')
const PrismaClass = require('../prisma/PrismaClass')
const prisma = PrismaClass.getPrisma()

class CategoryController {
    async store(req, res) {
        const { name, userId } = req.body

        try {
            const category = await prisma.category.create({
                data: {
                    name
                }
            })

            if(!category) {
                PrismaClass.disconnect()
                return res.status(400).json({ error: 'Error creating category' })
            }

            PrismaClass.disconnect()

            await prisma.userCategoryRelation.create({
                data: {
                    userId: parseInt(userId),
                    categoryId: category.id
                }
            })

            return res.status(200).json({ category })
        } catch (error) {
            console.log(error)
            PrismaClass.disconnect()
            return res.status(500).json({ error: 'Internal server error' })
        }
    }

    async index(req, res) {
        const { userId } = req.params

        try {
            const categories = await prisma.$queryRaw`SELECT * FROM Category a
            INNER JOIN UserCategoryRelation b ON a.id = b.categoryId
            WHERE b.userId = ${userId}`
            
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
            const projects = await prisma.$queryRaw`SELECT * FROM Project a
            INNER JOIN UserProjectRelation b ON a.id = b.projectId
            WHERE b.userId = ${userId} AND a.categoryId = ${id}`
            
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