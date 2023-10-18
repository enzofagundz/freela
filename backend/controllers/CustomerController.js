const { Prisma } = require('@prisma/client')
const PrismaClass = require('../prisma/PrismaClass')
const prisma = PrismaClass.getPrisma()

class CustomerController {
    async store(req, res) {
        const { name, email, userId } = req.body

        try {
            const customer = await prisma.customer.create({
                data: {
                    name,
                    email,
                }
            })

            if(!customer) {
                PrismaClass.disconnect()
                return res.status(400).json({ error: 'Error creating customer' })
            }

            await prisma.userCustomerRelation.create({
                data: {
                    userId: parseInt(userId),
                    customerId: customer.id
                }
            })

            return res.status(201).json({ customer })
        } catch (error) {
            console.log(error)
            PrismaClass.disconnect()
            return res.status(500).json({ error: 'Internal server error' })
        }
    }

    async index(req, res) {
        const { userId } = req.params

        try {
            const customers = await prisma.customer.findMany({
                where: {
                    user: {
                        some: {
                            userId: parseInt(userId)
                        }
                    }
                }
            })

            PrismaClass.disconnect()
            if(!customers) {
                return res.status(400).json({ error: 'Error listing customers' })
            }

            return res.status(200).json({ customers })
        } catch (error) {
            console.log(error)
            PrismaClass.disconnect()
            return res.status(500).json({ error: 'Internal server error' })
        }
    }

    async show(req, res) {
        const { id } = req.params

        try {
            const customer = await prisma.customer.findUnique({
                where: {
                    id: parseInt(id)
                }
            })

            PrismaClass.disconnect()

            if(!customer) {
                return res.status(400).json({ error: 'Error listing customer' })
            }

            return res.status(200).json({ customer })
        } catch (error) {
            console.log(error)
            PrismaClass.disconnect()
            return res.status(500).json({ error: 'Internal server error' })
        }
    }

    async update(req, res) {
        const { id } = req.params

        const { name, email } = req.body

        try {
            const customer = await prisma.customer.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    name,
                    email
                }
            })

            PrismaClass.disconnect()

            if(!customer) {
                return res.status(400).json({ error: 'Error updating customer' })
            }

            return res.status(200).json({ customer })
        } catch (error) {
            console.log(error)
            PrismaClass.disconnect()
            return res.status(500).json({ error: 'Internal server error' })
        }
    }

    async destroy(req, res) {
        const { id } = req.params

        try {
            await prisma.userCustomerRelation.deleteMany({
                where: {
                    customerId: parseInt(id)
                }
            })

            const customer = await prisma.customer.delete({
                where: {
                    id: parseInt(id)
                }
            })

            PrismaClass.disconnect()

            if(!customer) {
                return res.status(400).json({ error: 'Error deleting customer' })
            }

            return res.status(200).json({ message: 'Customer deleted' })
        } catch (error) {
            console.log(error)
            PrismaClass.disconnect()
            return res.status(500).json({ error: 'Internal server error' })
        }
    }

    async getProjectsByCustomer(req, res) {
        const { id, userId } = req.params

        try {
            const projects = await prisma.$queryRaw`SELECT * FROM Project
            INNER JOIN UserProjectRelation ON Project.id = UserProjectRelation.projectId
            WHERE UserProjectRelation.userId = ${userId} AND Project.customerId = ${id}`
            
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

module.exports = new CustomerController()