import sessionService from "../services/sessionsServices.js";
import { response } from "../utils/response.js";

export async function login(req, res) {
  const { email, password } = req.body;
  const token = await sessionService.login(email, password);
  res.cookie("coderCookieToken", token, {
    maxAgre: 60 * 60 * 1000,
    httpOnly: true,
  });
  response(res, 200, "Login correcto");
}

export async function register(req, res) {
  const { first_name, last_name, age, email, password } = req.body;
  const token = await sessionService.register({
    first_name,
    last_name,
    age,
    email,
    password,
  });
  res.cookie("coderCookieToken", token, {
    maxAgre: 60 * 60 * 1000,
    httpOnly: true,
  });
  response(res, 200, "register correcto");
}

export async function logout(req, res) {
  await sessionService.logout(req, res, req.user.user.email);
  response(res, 200, "logout correcto");
}

export async function current(req, res) {
  const data = await sessionService.current(req, res);
  response(res, 200, data);
}

export async function deleteInactives(req, res) {
  const data = await sessionService.deleteInactive();
  response(res, 200, data);
}
