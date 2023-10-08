const express = require('express');
const app = express();

const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/api');

dotenv.config();
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(routes)
app.use(express.static('public'))

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App rodando na porta ${port}!`));