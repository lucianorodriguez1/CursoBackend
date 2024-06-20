import { usersRepository } from "../repositories/index.js";
import { cartsRepository } from "../repositories/index.js";
import { generateToken } from "../utils/jwt.js";
import { isValidPassword, createHash } from "../utils/bcrypt.js";
import { response } from "../utils/response.js";

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await usersRepository.getUserByEmail(email);

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
    const cartObject = await cartsRepository.createCart();
    const cartId = cartObject[0]._id;
    const newUser = await usersRepository.createUser({
      first_name,
      last_name,
      age,
      email,
      password: passwordHash,
      cartId: cartId,
    });
    const user = await usersRepository.getUserByEmail(email);
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

export async function current(req, res) {
  response(res,200,req.user)
}
