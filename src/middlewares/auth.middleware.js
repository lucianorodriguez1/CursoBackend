export function auth(req, res, next) {
  if (req.session.user === "pepe" && req.session.admin) {
    return next();
  } 
  console.log(req.session.user, req.session.admin)
  return res.status(401).send('error de autorizacion');
}
