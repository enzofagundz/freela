const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController')
const UserController = require('../controllers/UserController')
const ProjectController = require('../controllers/ProjectController')
const CustomerController = require('../controllers/CustomerController')
const CategoryController = require('../controllers/CategoryController')

router.post('/auth', (req, res) => AuthController.store(req, res))
router.patch('/auth', (req, res) => AuthController.update(req, res))
router.post('/register', (req, res) => UserController.store(req, res))
router.post('/login', (req, res) => AuthController.show(req, res))
router.post('/projects', (req, res) => ProjectController.store(req, res))
router.post('/customers', (req, res) => CustomerController.store(req, res))
router.post('/categories', (req, res) => CategoryController.store(req, res))
module.exports = router;