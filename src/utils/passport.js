import passport from "passport";

export const passportCall = (strategy) =>{
    return async(req,res,next)=>{
        passport.authenticate(strategy,function(err,user,info){
            if(err) return next(err);
            if(!user){
                return res.status(401).send({error:"User not found"});
            }
            console.log(req)
            req.user = user;
            console.log(req)
            next();
        })(req,res,next);
    }
}