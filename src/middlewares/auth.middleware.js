export function auth(req, res, next) {
  if (req.session.user === "pepe" && req.session.admin) {
    return next();
  } 
  
  return res.status(401).send('error de autorizacion');
}
export function isLogin(req, res, next) {
  if (req.session.isLogin) {
    return next();
  } 
  
  return res.status(401).send('No te logueaste');
}

