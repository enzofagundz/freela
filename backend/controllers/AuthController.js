const { Prisma } = require('@prisma/client')
const PrismaClass = require('../prisma/PrismaClass')
const prisma = PrismaClass.getPrisma()
const Transporter = require('../config/Transporter')
const bcrypt = require('bcrypt')

class AuthController {
    async store(req, res) {
        const { email } = req.body

        try {
            const user  = await prisma.user.findUnique({
                where: {
                    email
                }
            })

            if(user) {
                return res.status(400).json({ error: 'Usuário inválido' }) 
            }

            const token = Math.floor(100000 + Math.random() * 900000);

            await prisma.tempUser.create({
                data: {
                    email,
                    token: token,
                    expiresAt: new Date(Date.now() + 60000)
                }
            })

            PrismaClass.disconnect()

            const mailOptions = {
                from: process.env.USER_EMAIL,
                to: email,
                subject: 'Código de verificação',
                text: `Seu código de verificação é ${token}`
            }

            await Transporter.sendMail(mailOptions)

            return res.status(200).json({ message: 'E-mail enviado com sucesso', email })
        } catch (error) {
            PrismaClass.disconnect()
            console.log(error)
            return res.status(500).json({ error: 'Ops, ocorreu um erro interno, tente novamente' })
        }
    }

    async show(req, res) {
        const { email, password } = req.body

        try {
            const user = await prisma.user.findUnique({
                where: {
                    email
                }
            })

            PrismaClass.disconnect()
            
            if(!user) {
                return res.status(400).json({ error: 'Usuário e/ou senha inválidos' })
            }

            bcrypt.compare(password, user.password).then((result, err) => {
                if(!result) {
                    console.log(result)
                    return res.status(400).json({ error: 'Usuário e/ou senha inválidos' })
                }
                
                if(err) {
                    console.log(err)
                    return res.status(400).json({ error: 'Usuário e/ou senha inválidos' })
                }

                delete user.password
                
                return res.status(200).json(user)
            })
        } catch (error) {
            PrismaClass.disconnect()
            console.log(error)
            return res.status(500).json({ error: 'Ops, ocorreu um erro interno, tente novamente' })
        }
    }

    async update(req, res) {
        const { email, token } = req.body

        try {
            const tempUser = await prisma.tempUser.findUnique({
                where: {
                    email
                }
            })

            if(!tempUser) {
                return res.status(400).json({ error: 'Usuário e/ou token inválidos' })
            }

            if(tempUser.token !== parseInt(token)) {
                return res.status(400).json({ error: 'Usuário e/ou token inválidos' })
            }

            if(tempUser.expires_at < new Date()) {
                return res.status(400).json({ error: 'Token inválido' })
            }

            await prisma.tempUser.update({
                where: {
                    email
                },
                data: {
                    expiresAt: new Date(Date.now() - 60000),
                    used: true
                }
            })

            PrismaClass.disconnect()

            return res.status(200).json({ message: 'Token validado com sucesso' })
        } catch (error) {
            PrismaClass.disconnect()
            console.log(error)
            return res.status(500).json({ error: 'Ops, ocorreu um erro interno, tente novamente server error' })
        }
    }
}

module.exports = new AuthController()