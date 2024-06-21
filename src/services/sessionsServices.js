import { cartsRepository } from "../repositories/index.js";
import { usersRepository } from "../repositories/index.js";
import { generateToken } from "../utils/jwt.js";
import { isValidPassword, createHash } from "../utils/bcrypt.js";

class SessionService {
    constructor() { }

    async login(email, password) {
        const user = await usersRepository.getUserByEmail(email);
        const token = generateToken(user);
        return token
        
    }
    async register(data) {
        const passwordHash = createHash(data.password);
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
    }
    async logout(req, res) {
        res.clearCookie("coderCookieToken");
    }

    async current(req) {
        return req.user
    }
}

const sessionService = new SessionService();
export default sessionService;
