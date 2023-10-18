const { Prisma } = require('@prisma/client')
const PrismaClass = require('../prisma/PrismaClass')
const prisma = PrismaClass.getPrisma()

class ProjectController {
    async store(req, res) {
        const {
            name,
            description,
            price,
            status,
            deliveryDate,
            userId,
            customerId,
            categoryId,
        } = req.body

        try {
            const [customer, category] = await Promise.all([
                prisma.customer.findUnique({
                    where: {
                        id: parseInt(customerId)
                    }
                }),
                prisma.category.findUnique({
                    where: {
                        id: parseInt(categoryId)
                    }
                })
            ]);

            if (!customer || !category) {
                PrismaClass.disconnect()
                return res.status(400).json({ error: 'Error creating project' })
            }

            const project = await prisma.project.create({
                data: {
                    name,
                    description,
                    price,
                    status,
                    deliveryDate: new Date(deliveryDate),
                    customer: {
                        connect: {
                            id: parseInt(customerId)
                        }
                    },
                    category: {
                        connect: {
                            id: parseInt(categoryId)
                        }
                    }
                },
                include: {
                    category: true,
                    customer: true
                }
            });
            if (!project) {
                PrismaClass.disconnect()
                return res.status(400).json({ error: 'Error creating project' })
            }

            await prisma.userProjectRelation.create({
                data: {
                    userId: parseInt(userId),
                    projectId: project.id
                }
            })

            PrismaClass.disconnect()
            return res.status(200).json(project)
        } catch (error) {
            PrismaClass.disconnect()
            console.log(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }

    async index(req, res) {
        const { userId } = req.params
        try {
            const projects = await prisma.project.findMany({
                where: {
                    user: {
                        some: {
                            userId: parseInt(userId)
                        }
                    }
                },
                include: {
                    category: true,
                    customer: true
                }
            })
            
            if (!projects) {
                PrismaClass.disconnect()
                return res.status(400).json({ error: 'Error listing projects' })
            }

            PrismaClass.disconnect()
            return res.status(200).json(projects)
        } catch (error) {
            PrismaClass.disconnect()
            console.log(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }

    async show(req, res) {
        const { id } = req.params

        try {
            const project = await prisma.project.findUnique({
                where: {
                    id: parseInt(id)
                },
                include: {
                    category: true,
                    customer: true
                }
            })

            if (!project) {
                PrismaClass.disconnect()
                return res.status(400).json({ error: 'Error listing project' })
            }

            PrismaClass.disconnect()
            return res.status(200).json(project)
        } catch (error) {
            PrismaClass.disconnect()
            console.log(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }

    async update(req, res) {
        const { id } = req.params

        const {
            name,
            description,
            price,
            status,
            deliveryDate,
            customerId,
            categoryId,
        } = req.body

        try {
            const project = await prisma.project.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    name,
                    description,
                    price,
                    status,
                    deliveryDate: new Date(deliveryDate),
                    customer: {
                        connect: {
                            id: parseInt(customerId)
                        }
                    },
                    category: {
                        connect: {
                            id: parseInt(categoryId)
                        }
                    }
                },
                include: {
                    category: true,
                    customer: true
                }
            })

            if (!project) {
                PrismaClass.disconnect()
                return res.status(400).json({ error: 'Error updating project' })
            }

            PrismaClass.disconnect()
            return res.status(200).json(project)
        } catch (error) {
            PrismaClass.disconnect()
            console.log(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }

    async destroy(req, res) {
        const { id } = req.params

        try {
            await prisma.userProjectRelation.deleteMany({
                where: {
                    projectId: parseInt(id)
                }
            })

            await prisma.project.delete({
                where: {
                    id: parseInt(id)
                }
            })

            PrismaClass.disconnect()
            return res.status(200).json({ message: 'Project deleted' })
        } catch (error) {
            PrismaClass.disconnect()
            console.log(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }
}

module.exports = new ProjectController()