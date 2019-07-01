const Project = require('../models/project')
const User = require('../models/user')
const {nodeMailer} = require('../helpers/nodemailer')

class ProjectController{

    static getAll(req,res,next){
        Project
        .find({})
        .then(data =>{
            let found = []
            data.forEach(project =>{
                project.memberList.forEach(element =>{
                    if(element.equals(req.loggedUser.id)){
                        found.push(project)
                    }
                })
            })            
            res.status(200).json(found)
        })
        .catch(next)
    }

    static getOne(req,res,next){
        Project
        .findOne({_id : req.params.projectId})
        .populate('memberList')
        .populate('creator')
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static create(req,res,next){
        
        let member = JSON.parse(req.body.memberList)
        console.log('ini member broooo',member);
        member.forEach(user =>{
            User
            .findById(user)
            .then(data =>{
                console.log(data.email);
                nodeMailer(data.email,'invitation',{title : req.body.title, inviter : req.loggedUser.id})
            })
            .catch(next)
        })
        member.push(req.loggedUser.id)
        let project = new Project({
            title : req.body.title,
            description : req.body.description,
            creator : req.loggedUser.id,
            memberList : member
        })
        project.save()
        .then(data =>{
            console.log(data);
            res.status(201).json(data)
        })
        .catch(next)
    }

    static update(req,res,next){
        let member = JSON.parse(req.body.memberList)
        
        member.push(req.body.creator)

        let setVal = {}
        req.body.title && (setVal.title = req.body.title)
        req.body.description && (setVal.description = req.body.description)
        req.body.memberList && (setVal.memberList = member)

        Project
        .findById(req.params.projectId)
        .then(project =>{
            project.set(setVal)
            return project.save()
        })
        .then(updated =>{
            res.status(200).json(updated)
        })
        .catch(next)
    }

    static delete(req,res,next){
        Project
        .findByIdAndDelete(req.params.projectId)
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static invite(req,res,next){

        Project
        .findById(req.params.projectId)
        .then(project =>{
            return project.memberList.push(req.params.userId)
        })
        .then(project =>{
            res.status(200).json(project)
        })
        .catch(next)
    }
}

module.exports = ProjectController