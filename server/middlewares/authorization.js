const jwt = require('jsonwebtoken')
const Todo = require('../models/todo')

module.exports = function(req,res,next){
    // let todoId = req.params.id 
    // let userId = req.loggedUser.id
    let option = {
        _id : req.params.todoId,
        userId : req.loggedUser.id
    }
    Todo.findOne(option)
    .then(todo =>{
        if(todo){
            next()
        }else {
            next({code : 401, msg : `you're not authorized`})
        }
    })
    .catch(next)
    
}