module.exports = function(err,req,res,next){
    console.log('masuk error handler');
    console.log(err)
    if(err.name === 'TokenExpiredError'){
        res.status(400).json({
            message : 'run time exceeded'
        })
    }else{
        const status = err.code || 500
        const message = err.message || 'internal server error'
        res.status(status).json({
            msg : message
        })
    }
}