const moment = require('moment')
module.exports = {
    momentjs : function (due_date) {
        console.log('masuk moment',due_date);
        
        let dayLeft = moment(due_date);
        let in_date = moment(new Date())
        dayLeft = Math.ceil(moment.duration(dayLeft.diff(in_date)).asDays())
        console.log('remmaining day', dayLeft);
        
        return dayLeft
    }
}