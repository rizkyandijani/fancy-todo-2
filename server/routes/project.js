const router = require('express').Router()
const ProjectController = require('../controllers/project')

const authentication = require('../middlewares/authentication')
const authorization = require('../middlewares/authorization')

router.use(authentication)

router.get('/',ProjectController.getAll)
router.get('/:projectId',ProjectController.getOne)
router.post('/',ProjectController.create)
router.post('/:projectId/invite/:userId/',ProjectController.invite)
router.patch('/:projectId',ProjectController.update)
router.delete('/:projectId',ProjectController.delete)

module.exports = router