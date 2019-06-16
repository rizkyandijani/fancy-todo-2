const mongoose = require('mongoose')
const Schema = mongoose.Schema

let projectSchema = new Schema({
    title : String,
    description: String,
    creator: {type: Schema.Types.ObjectId, ref : 'user'},
    memberList: [{type: Schema.Types.ObjectId, ref : 'user'}],
})

let Project = mongoose.model('project',projectSchema)

module.exports = Project