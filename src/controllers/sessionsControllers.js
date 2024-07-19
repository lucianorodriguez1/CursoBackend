import config from "../config/config.js";
import sessionService from "../services/SessionService.js";
import { response } from "../utils/response.js";

export async function login(req, res) {
  const { email, password } = req.body;
  console.log(email,password)
  const result = await sessionService.login(email, password);
  res.cookie(config.tokenCookie, result.token, {
    maxAgre: 60 * 60 * 1000,
    httpOnly: true,
  });
  response(res, 200, result.message);
}

export async function register(req, res) {
  const { first_name, last_name, age, email, password } = req.body;
  const result = await sessionService.register({
    first_name,
    last_name,
    age,
    email,
    password,
  });
  res.cookie(config.tokenCookie, result.token, {
    maxAgre: 60 * 60 * 1000,
    httpOnly: true,
  });
  response(res, 200, result.message);
}

export async function logout(req, res) {
  const result = await sessionService.logout(req, res, req.user.data.email);
  res.clearCookie(result.cookie);
  response(res, 200, result.message);
}

export async function current(req, res) {
  const data = await sessionService.current(req, res);
  response(res, 200, data);
}

export async function deleteInactives(req, res) {
  const data = await sessionService.deleteInactive();
  response(res, 200, data);
}
