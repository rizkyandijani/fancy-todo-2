const mongoose = require("mongoose")
const {momentjs} = require('../helpers/moment')
const Schema = mongoose.Schema

let todoSchema = new Schema({
    title : String,
    description : String,
    created_at: Date,
    dueDate: Date,
    status: String,
    projectId : String,
    tags : Array,
    userId : String,
    dayLeft : String
})

// todoSchema.post('find',function(result){
//     result.forEach(el => {
//         el.dayLeft = momentjs(el.dueDate)
//     })
// })

let Todo = mongoose.model('todo',todoSchema)

module.exports = Todo