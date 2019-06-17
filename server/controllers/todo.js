const Todo = require('../models/todo')
const Project = require('../models/project')
class TodoController{

    static getAll(req,res,next){
        console.log('masuk read',req.query.search);
        
        let queryTag = req.query.tag
        let querySearch = req.query.search
        let option = {
            userId : req.loggedUser.id,
            title : {$regex : `.*${querySearch}.*`}
        }
        if(!querySearch) delete option.title
        Todo
        .find(option)
        .then(data =>{
            if(queryTag){
                console.log('ini query tag',queryTag);
                
                let filtered = []
                data.forEach(todo =>{
                    console.log('ini todo',todo);
                    if(todo.tags.indexOf(queryTag) !== -1){
                        filtered.push(todo)
                    }
                })
                console.log('ini filtered',filtered);
                
                res.status(200).json(filtered)
            }else{
                res.status(200).json(data)
            }
        })
        .catch(next)
    }

    static getProjectTodos(req,res,next){
        Todo
        .find({projectId : req.params.projectId})
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static getOne(req,res,next){
        Todo
        .findOne({_id : req.params.todoId})
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static create(req,res,next){
        let tags = JSON.parse(req.body.tagsUpdate) 
        let filteredTag = []
        tags.forEach(tagger =>{
            if(tagger !== ''){
                filteredTag.push(tagger)
            }
        })
        filteredTag.forEach(tag => {
            if(tag[0] === ' '){
                tag = tag.substring(1, tag.length)
            }else if(tag[tag.length-1] === ' '){
                tag = tag.substring(0,tag.length-1)
            }else{
                tag = tag
            }
        });
        let todo = new Todo({
            title : req.body.title,
            description : req.body.description,
            created_at : new Date,
            dueDate: req.body.dueDate,
            status: 'undone',
            projectId : req.body.projectId,
            tags : filteredTag,
            userId : req.loggedUser.id
        })
        todo.save()
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static update(req,res,next){
        
        let setVal = {}
        req.body.title && (setVal.title = req.body.title) 
        req.body.description && (setVal.description = req.body.description)
        req.body.dueDate && (setVal.dueDate = req.body.dueDate)
        req.body.status && (setVal.status = req.body.status)
        req.body.projectId && (setVal.projectId = req.body.projectId)
        
        if(req.body.tags){
            let tags = req.body.tags.split(',')
            
            let filteredTag = []
            tags.forEach(tagger =>{
                if(tagger !== ''){
                    filteredTag.push(tagger)
                }
            })
            
            filteredTag.forEach(tag => {
                if(tag[0] === ' '){
                    tag = tag.substring(1, tag.length)
                }else if(tag[tag.length-1] === ' '){
                    tag = tag.substring(0,tag.length-1)
                }else{
                    tag = tag
                }
            });
            setVal.tags = filteredTag
        }
        

        
        Todo
        .findById(req.params.todoId)
        .then(todo =>{
            todo.set(setVal)
            return todo.save()
        })
        .then(updated =>{
            res.status(200).json(updated)
        })
        .catch(next)
    }

    static delete(req,res,next){
        Todo
        .findByIdAndDelete(req.params.todoId)
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static deleteTodoProject(req,res,next){
        Todo
        .deleteMany({projectId : req.params.projectId})
        .then(response =>{
            res.status(200).json(response)
        })
        .catch(next)
    }

}

module.exports = TodoController