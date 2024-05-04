export function auth(req, res, next) {
  if (req.session.user === "pepe" && req.session.admin) {
    return next();
  } 
  return res.status(401).send('error de autorizacion');
}

export function isLogin(req, res, next) {
  if (req.user) {
    return next();
  } 
  return res.status(401).send('No autenticado');
}

export function authorization(role){
  return async(req,res,next)=>{
    if(!req.user) return res.status(401).send({error:"Unauthorized"});
    if(req.user.user.rol!=role) return res.status(403).send({error:"No permissions"});
    next();
  }
}

