module.exports = function(err,req,res,next){
    console.log('masuk error handler');
    console.log(err)
    const status = err.code || 500
    const message = err.msg || 'internal server error'
    res.status(status).json({
        msg : message
    })
}