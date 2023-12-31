const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController')
const UserController = require('../controllers/UserController')
const ProjectController = require('../controllers/ProjectController')
const CustomerController = require('../controllers/CustomerController')
const CategoryController = require('../controllers/CategoryController')

router.get('/', (req, res) => {
    return res.status(200).json({ message: 'Hello World' })
})

// Auth
router.post('/auth', (req, res) => AuthController.store(req, res))
router.patch('/auth', (req, res) => AuthController.update(req, res))
router.post('/login', (req, res) => AuthController.show(req, res))

// Users
router.post('/register', (req, res) => UserController.store(req, res))
router.patch('/user/:id', (req, res) => UserController.update(req, res))

// Projects
router.post('/projects', (req, res) => ProjectController.store(req, res))
router.get('/projects/:userId', (req, res) => ProjectController.index(req, res))
router.get('/project/:id', (req, res) => ProjectController.show(req, res))
router.patch('/project/:id', (req, res) => ProjectController.update(req, res))
router.delete('/project/:id', (req, res) => ProjectController.destroy(req, res))

// Customers
router.post('/customers', (req, res) => CustomerController.store(req, res))
router.get('/customers/:userId', (req, res) => CustomerController.index(req, res))
router.get('/customer/:id', (req, res) => CustomerController.show(req, res))
router.patch('/customer/:id', (req, res) => CustomerController.update(req, res))
router.delete('/customer/:id', (req, res) => CustomerController.destroy(req, res))
router.get('/customer/:id/user/:userId', (req, res) => CustomerController.getProjectsByCustomer(req, res))

// Categories
router.post('/categories', (req, res) => CategoryController.store(req, res))
router.get('/categories/:userId', (req, res) => CategoryController.index(req, res))
router.get('/category/:id/projects/:userId', (req, res) => CategoryController.getProjectsByCategory(req, res))

module.exports = router;