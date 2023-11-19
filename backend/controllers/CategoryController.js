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
                return res.status(400).json({ error: 'Erro ao criar categoria' })
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
            return res.status(500).json({ error: 'Ops, ocorreu um erro interno, tente novamente server error' })
        }
    }

    async index(req, res) {
        const { userId } = req.params

        try {
            const categories = await prisma.category.findMany({
                where: {
                    user: {
                        some: {
                            userId: parseInt(userId)
                        }
                    }
                }
            })

            PrismaClass.disconnect()

            if(!categories) {
                return res.status(400).json({ error: 'Erro ao listar categorias' })
            }

            return res.status(200).json({ categories })
        } catch (error) {
            console.log(error)
            PrismaClass.disconnect()
            return res.status(500).json({ error: 'Ops, ocorreu um erro interno, tente novamente server error' })
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
                return res.status(400).json({ error: 'Erro ao listar categorias' })
            }

            const projectsWithConvertedPrice = projects.map(project => ({
                ...project,
                price: Number(project.price)
            }));

            return res.status(200).json({ projects: projectsWithConvertedPrice })
        } catch (error) {
            console.log(error)
            PrismaClass.disconnect()
            return res.status(500).json({ error: 'Ops, ocorreu um erro interno, tente novamente server error' })
        }
    }
}

module.exports = new CategoryController()