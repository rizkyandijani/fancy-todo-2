const router = require('express').Router()
const UserController = require('../controllers/user')
const authentication = require('../middlewares/authentication')


router.get('/',authentication,UserController.getAll)
router.get('/:userId',UserController.getOne)
router.post('/register',UserController.register)
router.post('/login',UserController.login)
router.post('/loginGoogle',UserController.loginGoogle)
router.patch('/:userId',UserController.update)
router.delete('/:userId',UserController.delete)

module.exports = router