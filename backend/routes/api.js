const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController')
const UserController = require('../controllers/UserController')
const ProjectController = require('../controllers/ProjectController')

router.post('/auth', (req, res) => AuthController.store(req, res))
router.put('/auth', (req, res) => AuthController.update(req, res))
router.post('/register', (req, res) => UserController.store(req, res))
router.post('/login', (req, res) => AuthController.show(req, res))
router.post('/projects', (req, res) => ProjectController.store(req, res))

router.get('/job', (req, res) => {
    const job = require('../data/job.json')
    return res.json(job)
})

module.exports = router;