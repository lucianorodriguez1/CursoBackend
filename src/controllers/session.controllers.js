import { usersService } from "../repositories/index.js";
import { cartsService } from "../repositories/index.js";
import { generateToken } from "../utils/jwt.js";
import { isValidPassword, createHash } from "../utils/bcrypt.js";

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await usersService.getUserByEmail(email);

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
      .send("Login correcto");
  } catch (error) {
    console.log(error);
  }
}
export async function register(req, res) {
  try {
    const { first_name, last_name, age, email, password } = req.body;
    const passwordHash = createHash(password);
    const cartObject = await cartsService.createCart();
    const cartId = cartObject[0]._id;
    const newUser = await usersService.createUser({
      first_name,
      last_name,
      age,
      email,
      password: passwordHash,
      cartId: cartId,
    });
    const user = await usersService.getUserByEmail(email);
    const token = generateToken(user);
    res
      .cookie("coderCookieToken", token, {
        maxAgre: 60 * 60 * 1000,
        httpOnly: true,
      })
      .send("Login correcto");
  } catch (error) {
    if (error.message.includes("Duplicate key error")) {
      return res.render("register", { error: "Email duplicado" });
    } else {
      res.status(500).send({ message: "An unexpected error occurred." });
    }
  }
}
export async function logout(req, res) {
  res.clearCookie("coderCookieToken");
  res.redirect("/");
}
