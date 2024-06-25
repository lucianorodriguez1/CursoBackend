import { Router } from "express";
import { transport } from "../../utils/nodemailer.js";
import config from "../../config/config.js";
import { response } from "../../utils/response.js";

const mailRouter = Router();

mailRouter.get("/", async (req, res) => {
  let result = await transport.sendMail({
    from: `lucho rodri <${config.correoGmail}>`,
    to: "lucerolucho801@gmail.com",
    subject: "correo pruebaa subj",
    html: `
        <div>
            <h3>luchito cuidate</h3>
        </div>
        `,
        attachments:[]
  });
  response(res, 200, result);
});

export default mailRouter;
