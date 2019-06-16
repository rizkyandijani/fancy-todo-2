const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {hash} = require('../helpers/bcrypt')

let userSchema = new Schema({
    firstName : String,
    lastName: String,
    email : {
        type : String,
        validate : [{
            validator: function validateEmail(email) 
                {
                    var re = /\S+@\S+\.\S+/;
                    return re.test(email);
                },
                message: props => `${props.value} is not a valid email`
        },
        {
            validator: function(){
                return new Promise((res, rej) =>{
                User.findOne({email: this.email, _id: {$ne: this._id}})
                    .then(data => {
                        if(data) {
                            res(false)
                        } else {
                            res(true)
                        }
                    })
                    .catch(err => {
                        res(false)
                    })
                })
            }, message: 'email already taken'
        }
    ],
        required : [true, 'email must be inserted'],
    },
    password: String
})

userSchema.pre('save',function(next){
    this.password = hash(this.password)
    next()
})

let User = mongoose.model('user',userSchema)

module.exports = User