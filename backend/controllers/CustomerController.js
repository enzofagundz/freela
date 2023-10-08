const { Prisma } = require('@prisma/client')
const PrismaClass = require('../prisma/PrismaClass')
const prisma = PrismaClass.getPrisma()

class CustomerController {
    async store(req, res) {
        const { email, name } = req.body
        
        try {
            const customer = await prisma.customer.create({
                data: {
                    email,
                    name
                }
            })

            PrismaClass.disconnect()

            if(!customer) {
                return res.status(400).json({ error: 'Error creating customer' })
            }

            return res.status(200).json(customer)
        } catch (error) {
            PrismaClass.disconnect()
            console.log(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }

    async index(req, res) {
        try {
            const customers = await prisma.customer.findMany({
                include: {
                    projects: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })

            PrismaClass.disconnect()

            if(!customers) {
                return res.status(400).json({ error: 'Error listing customers' })
            }

            return res.status(200).json(customers)
        } catch (error) {
            PrismaClass.disconnect()
            console.log(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }

    async show(req, res) {
        const { id } = req.params

        try {
            const customer = await prisma.customer.findUnique({
                where: {
                    id: parseInt(id)
                },
                include: {
                    projects: true
                }
            })

            PrismaClass.disconnect()

            if(!customer) {
                return res.status(400).json({ error: 'Error listing customer' })
            }

            return res.status(200).json(customer)
        } catch (error) {
            PrismaClass.disconnect()
            console.log(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }

    async update(req, res) {
        const { email, name } = req.body

        try {
            const customer = await prisma.customer.update({
                where: {
                    email
                },
                data: {
                    name
                }
            })

            PrismaClass.disconnect()

            if(!customer) {
                return res.status(400).json({ error: 'Error updating customer' })
            }

            return res.status(200).json(customer)
        } catch (error) {
            PrismaClass.disconnect()
            console.log(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }

    async destroy(req, res) {
        const { id } = req.params

        try {
            await prisma.customer.delete({
                where: {
                    id: parseInt(id)
                }
            })

            PrismaClass.disconnect()

            return res.status(200);
        } catch (error) {
            PrismaClass.disconnect()
            console.log(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }
}

module.exports = new CustomerController()