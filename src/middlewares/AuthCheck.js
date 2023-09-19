const passport = require('passport')


module.exports= class AuthCheck{
    static isAuth(req,res,next){
        passport.authenticate('jwt', (err, user, info) => {
            if (err) {
                console.log(info)
                console.log(err)
                return next(err)
            }
            if (!user) {
                var data={
                    "status":false,
                    "code":401,
                    "message":"Unuthorized",
                    "data":null
                }
                return res.status(401).json(data);
            }
    
            req.user = user
            return next()
        })(req, res, next)
    }
}