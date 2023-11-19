const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors')
const routes = require('./routes/api')
const helmet = require('helmet')
const compression = require('compression')

dotenv.config();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(routes)
app.use(express.static('public'))
app.use(helmet())
app.use(compression())

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`App rodando na porta ${port}!`))