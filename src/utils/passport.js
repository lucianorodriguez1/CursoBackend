import passport from "passport";

export const passportCall = (strategy) =>{
    return async(req,res,next)=>{
        passport.authenticate(strategy,function(err,user,info){
            if(err) return next(err);
            if(!user){
                return res.render("not-available");
            }
            req.user = user;
            next();
        })(req,res,next);
    }
}