const bcrypt = require('bcryptjs')

module.exports = {
    hash: function(password){
        return bcrypt.hashSync(password,8)
    },
    compare : function(password,hash) {
        return data = bcrypt.compareSync(password,hash)
    }
}