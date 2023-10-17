const { Prisma } = require('@prisma/client')
const PrismaClass = require('../prisma/PrismaClass')
const prisma = PrismaClass.getPrisma()

class CustomerController {
    async store(req, res) {
        const { name, email } = req.body

        try {
            const customer = await prisma.customer.create({
                data: {
                    name,
                    email
                }
            })

            PrismaClass.disconnect()
            if(!customer) {
                return res.status(400).json({ error: 'Error creating customer' })
            }

            return res.status(200).json({ customer })
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

module.exports = new CustomerController()