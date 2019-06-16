const User = require('../models/user')
const { compare } = require('../helpers/bcrypt')
const { sign } = require('../helpers/jwt')
const {OAuth2Client} = require('google-auth-library')

class UserController{
    static getAll(req,res,next){
        User
        .find({})
        .then(data =>{
            let filtered = []
            data.forEach(user =>{
                if(!user._id.equals(req.loggedUser.id)){
                    filtered.push(user)
                }
            })
            res.status(200).json(filtered)
        })
        .catch(next)
    }

    static getOne(req,res,next){
        User
        .findById(req.params.userId)
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }

    static register(req,res,next){
        let user = new User({
            firstName : req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        })
        user.save()
        .then(value =>[
            res.status(201).json(value)
        ])
        .catch(next)
    }

    static login(req,res,next){
        User
        .findOne({email : req.body.email})
        .then(user =>{
            if(user){
                if(compare(req.body.password,user.password)){
                    let payload = {
                        email : user.email,
                        id : user.id
                    }
                    let token = sign(payload)
                    res.status(200).json({
                        token,
                        firstName : user.firstName,
                        lastName : user.lastName,
                        email : user.email,
                        id : user.id
                    })
                }else {
                    throw { code : 404, msg : `username/password salah`}
                }  
            }else{
                throw { code : 404, msg : `username/password salah`}
            }
        })
        .catch(next)
    }

    static loginGoogle(req,res,next){
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
        client.verifyIdToken({
            idToken :  req.headers.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        .then(ticket =>{
            const payload = ticket.getPayload()
            User.findOne({email : payload.email})
            .then(user =>{
                if(!user){
                    let name = payload.name.split(' ')
                    let firstName = name[0]
                    let lastName = name.slice(1).join(' ')

                    let user = new User({
                        firstName : firstName,
                        lastName : lastName,
                        email : payload.email,
                        password : 12345
                    })
                    return user.save()
                }else{
                    return user
                }
            })
            .then(user =>{
                let payload  = {
                    id : user._id,
                    email : user.email
                }
                const token = sign(payload)
                res.status(200).json({
                    token,
                    firstName : user.firstName,
                    lastName : user.lastName,
                    email : user.email,
                    id : user._id
                })
            })
            .catch(next)
        })
    }

    static update(req,res,next){
        let setVal = {}
        req.body.firstName && (setVal.firstName = req.body.firstName) 
        req.body.lastName && (setVal.lastName = req.body.lastName)
        req.body.email && (setVal.dueDate = req.body.dueDate)
        
        User
        .findById(req.params.userId)
        .then(user =>{
            user.set(setVal)
            return user.save()
        })
        .then(updated =>{
            res.status(200).json(updated)
        })
        .catch(next)
    }

    static delete(req,res,next){
        User
        .findByIdAndDelete(req.params.userId)
        .then(data =>{
            res.status(200).json(data)
        })
        .catch(next)
    }
}

module.exports = UserController

