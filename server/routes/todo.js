const router = require('express').Router()
const TodoController = require('../controllers/todo')

const authentication = require('../middlewares/authentication')
const authorization = require('../middlewares/authorization')

router.use(authentication)

router.get('/',TodoController.getAll)
router.get('/:projectId/projects',TodoController.getProjectTodos)
router.get('/:todoId',TodoController.getOne)
router.post('/',TodoController.create)
router.patch('/:todoId',TodoController.update)
router.delete('/:todoId',TodoController.delete)
router.delete('/:projectId/project',TodoController.deleteTodoProject)

module.exports = router