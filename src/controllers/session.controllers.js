import { userManager } from "../dao/MongoDB/managers/user.dao.js";
import { generateToken } from "../utils/jwt.js";
import { isValidPassword,createHash } from "../utils/bcrypt.js";
import { cartManager } from "../dao/MongoDB/managers/cart.dao.js";

export async function login(req,res){
    const { email, password } = req.body;
  try {
    const user = await userManager.getUserByEmail(email);
    if (!user)
      return res.render("login", { error: "credenciales incorrectas" });
    const validatePassword = isValidPassword(user, password);
    if (!validatePassword)
      return res.render("login", { error: "credenciales incorrectas" });
    const token = generateToken(user);
    res
      .cookie("coderCookieToken", token, {
        maxAgre: 60 * 60 * 1000,
        httpOnly: true,
      })
      .redirect("/");
  } catch (error) {
    console.log(error);
  } 
}
export async function register(req,res){
    try {
    const { first_name, last_name, age, email, password } = req.body;
    const passwordHash = createHash(password);
    const cartObject = await cartManager.createCart();
    const cartId = cartObject[0]._id;
    const newUser = await userManager.createUser({
      first_name,
      last_name,
      age,
      email,
      password: passwordHash,
      cartId:cartId
    });
    const user = await userManager.getUserByEmail(email);
    const token = generateToken(user);
    res
      .cookie("coderCookieToken", token, {
        maxAgre: 60 * 60 * 1000,
        httpOnly: true,
      })
      .redirect("/");
  } catch (error) {
    if (error.message.includes('Duplicate key error')) {
      return res.render("register",{error:"Email duplicado"});
    } else {
      res.status(500).send({ message: 'An unexpected error occurred.' });
    }
  }
}
export async function logout(req,res){
    res.clearCookie("coderCookieToken");
    res.redirect("/");
}