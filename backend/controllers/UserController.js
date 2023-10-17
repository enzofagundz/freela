const { Prisma } = require('@prisma/client')
const PrismaClass = require('../prisma/PrismaClass')
const prisma = PrismaClass.getPrisma()
const bcrypt = require('bcrypt')

class UserController {
    async store(req, res) {
        const { email, password, confirmPassword, name, role } = req.body
        
        try {
            const [user, verifyUser] = await prisma.$transaction([
                prisma.user.findUnique({
                    where: {
                        email
                    }
                }),
                prisma.tempUser.findUnique({
                    where: {
                        email
                    }
                })
            ])

            if(!verifyUser.used) {
                return res.status(400).json({ error: 'User not authenticated' })
            }

            if(user) {
                return res.status(400).json({ error: 'User already exists' })
            }

            if(password !== confirmPassword) {
                return res.status(400).json({ error: 'Password does not match' })
            }

            const salt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(password, salt)

            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: passwordHash,
                    name,
                    role
                }
            })

            PrismaClass.disconnect()

            delete newUser.password
            return res.status(200).json({ user: newUser })
        } catch (error) {
            PrismaClass.disconnect()
            console.log(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }
    
    async update(req, res) {
        const { email, name, password, confirmPassword, work } = req.body

        try {
            const user = await prisma.user.findUnique({
                where: {
                    email
                }
            })

            if(!user) {
                return res.status(400).json({ error: 'User not found' })
            }

            if(password !== confirmPassword) {
                return res.status(400).json({ error: 'Password does not match' })
            }

            const salt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(password, salt)

            const updatedUser = await prisma.user.update({
                where: {
                    email
                },
                data: {
                    name,
                    password: passwordHash,
                    work
                }
            })

            PrismaClass.disconnect()

            delete updatedUser.password

            return res.status(200).json({ user: updatedUser })
        } catch (error) {
            PrismaClass.disconnect()
            console.log(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }

    async destroy(req, res) {
        const { email } = req.body

        try {
            await prisma.user.delete({
                where: {
                    email
                }
            })

            PrismaClass.disconnect()

            return res.status(200)
        } catch (error) {
            PrismaClass.disconnect()
            console.log(error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }
}

module.exports = new UserController()