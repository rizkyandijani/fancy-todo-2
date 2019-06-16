const router = require('express').Router()
const userRoute = require('./user')
const todoRoute = require('./todo')
const projectRoute = require('./project')

router.use('/users',userRoute)
router.use('/todos',todoRoute)
router.use('/projects',projectRoute)

module.exports = router