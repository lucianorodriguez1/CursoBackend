import { Router } from "express";
import { transport } from "../../utils/nodemailer.js";
import config from "../../config/config.js";
import { response } from "../../utils/response.js";

const mailRouter = Router();

mailRouter.post("/resetPassword", async (req, res) => {
  const { email } = req.body;

  try {
    let result = await transport.sendMail({
      from: `lucho rodri <${config.correoGmail}>`,
      to: email,
      subject: "Reestablecer contrasenia e-commerce",
      html: `
          <div>
              <a href="http://localhost:${config.port}/reestablecerContrasenia">Reestablecer mi contrasenia</a>
          </div>
          `,
          attachments:[]
    });
    response(res, 200, result);
  } catch (error) {
    console.log(error)
    res.status(500).json({error:true,message: "no se pudo mandar el correo"});
  }
  
});

export default mailRouter;
