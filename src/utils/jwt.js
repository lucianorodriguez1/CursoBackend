import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const token = jwt.sign( {user}, process.env.TOKEN_KEY, { expiresIn: "24h" });
  return token;
};
