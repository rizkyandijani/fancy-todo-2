const mongoose = require("mongoose")
const Schema = mongoose.Schema

let todoSchema = new Schema({
    title : String,
    description : String,
    created_at: Date,
    dueDate: Date,
    status: String,
    projectId : String,
    tags : Array,
    userId : String
})

let Todo = mongoose.model('todo',todoSchema)

module.exports = Todo