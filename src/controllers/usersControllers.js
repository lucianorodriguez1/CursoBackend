import UserDTO from "../dto/UserDto.js";
import { usersRepository } from "../repositories/index.js";
import { cartsRepository } from "../repositories/index.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { decodedToken, generatePasswordResetToken } from "../utils/jwt.js";
import config from "../config/config.js";
import { transport } from "../utils/nodemailer.js";
import { removeEmptyObjectFields } from "../utils/removeEmptyObjectFields.js";

export const createUser = async (req, res) => {
  const { first_name, last_name, age, email, password } = req.body;

  // Hash password
  const passwordHash = createHash(user.password);

  // Create cart by User
  const cartObject = await cartsRepository.createCart();
  const cartId = cartObject[0]._id;

  const newUser = {
    first_name: first_name,
    last_name: last_name,
    age: age,
    email: email,
    password: passwordHash,
    cartId: cartId,
  };

  const result = await usersRepository.createUser(newUser);

  const userDto = await UserDTO.getUserResponseForRole(result, null, null);
  res.status(201).json({ succes: true, data: userDto });
};

export const getUsers = async (req, res) => {
  const role = req.user.data.role;
  const email = req.user.data.email;

  const users = await usersRepository.getUsers();
  const result = await Promise.all(
    users.map(async (user) => UserDTO.getUserResponseForRole(user, role, email))
  );
  res.status(200).json({ succes: true, data: result });
};

export const getUser = async (req, res) => {
  const id = req.params.uid;
  const role = req.user.data.role;
  const email = req.user.data.email;

  let user = await usersRepository.getUserBy({ _id: id });
  if (!user) {
    res.status(404).json({ succes: false, message: "User not found" });
  }

  const userDto = await UserDTO.getUserResponseForRole(result, role, email);
  res.status(201).json({ succes: true, data: userDto });
};

export const deleteUser = async (req, res) => {
  const id = req.params.uid;

  let user = await usersRepository.getUserBy({ _id: id });
  if (!user) {
    res.status(404).json({ succes: false, message: "User not found" });
  }

  await cartsRepository.deleteCartById(user.cartId);
  const userDeleted = await usersRepository.deleteUserBy({ _id: id });
  const emailUserDel = await transport.sendMail({
    from: `lucho rodri <${config.correoGmail}>`,
    to: user.email,
    subject: "User eliminado",
    html: `
        <div>
            <p>Tu usuario fue eliminado.</p>
        </div>
        `,
    attachments: [],
  });
  res
    .status(200)
    .json({ success: true, data: userDeleted, message: emailUserDel });
};

export const updateUser = async (req, res) => {
  const id = req.params.uid;
  const { first_name, last_name, age, email, password } = req.body;
  const role = req.user.data.role;
  const eCurrent = req.user.data.email;

  const user = await usersRepository.getUserBy({ _id: id });
  if (!user) {
    res.status(404).json({ succes: false, message: "User not found" });
  }

  if (user.email != eCurrent && role != "admin") {
    res.status(403).json({
      succes: false,
      message: "You do not have permission to update user.",
    });
  }

  removeEmptyObjectFields(data);
  const result = await usersRepository.updateUserBy({ _id: id }, data);
  res.status(200).json({ success: true, data: result });
};

// Change role 'user' to 'premium' !!!
export const changePremium = async (req, res) => {
  const id = req.params.uid;

  let user = await usersRepository.getUserBy({ _id: id });
  if (!user) {
    res.status(404).json({ succes: false, message: "User not found" });
  }

  /**
   *
   *  Verify documents exists in user
   *
   */

  const requiredDocuments = [
    "identification",
    "proofOfResidence",
    "accountStatement",
  ];
  const userDocumentTypes = user.documents.map((doc) => doc.name);

  const missingDocuments = requiredDocuments.filter(
    (doc) => !userDocumentTypes.includes(doc)
  );

  if (missingDocuments.length > 0) {
    return `The following necessary documents are missing: ${missingDocuments.join(
      ", "
    )}`;
  }

  const result = await usersRepository.updateUserBy({ _id: id }, data);
  res.status(200).json({ success: true, data: result });
};

export async function sendEmailToResetPassword(req, res) {
  const { email } = req.body;

  await userService.getUserByEmail(email);
  const token = generatePasswordResetToken({ email: email });

  // Send email !!  ----

  const resetLink = `http://localhost:${config.port}/reestablecerContrasenia?token=${token}`;
  const result = await transport.sendMail({
    from: `lucho rodri <${config.correoGmail}>`,
    to: email,
    subject: "Reestablecer contraseña",
    html: `
          <div>
              <a href="${resetLink}">Reestablecer mi contraseña</a>
          </div>
          `,
    attachments: [],
  });

  // Response
  res.status(200).json({ succes: true, data: result });
}

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  // Decoded data
  const decoded = decodedToken(token);
  const email = decoded.data.email;
  const user = await userService.getUserByEmail(email);

  if (isValidPassword(user, password)) {
    res.status(404).json({success:false, message: 'The password is the samE'})
  }
  const passwordHash = createHash(password);

  const result = await usersRepository.updateUserBy(
    { _id: user._id },
    { password: passwordHash }
  );

  const userDto = await UserDTO.getUserResponseForRole(result, null, email);
  res.status(200).json({ succes: true, data: userDto });

};


export const uploadProfilePhoto = async (req, res) => {
  const userId = req.params.uid;
  const photo = req.file;

  //  Verify User and photo if exists
  if (!photo) {
    return res.status(400).send({ message: "No photo were uploaded." });
  }

  const user = await usersRepository.getUserBy({ _id: userId });

  if (!user) {
    res.status(404).json({ succes: false, message: "User not found" });
  }



   const updateData = {
      profilePhoto: {
        name: photo.originalname,
        reference: `/img/profiles/${photo.filename}`,
      },
    };


    const result = await usersRepository.updateUserBy({ _id: uid }, updateData);
    res.status(200).json({success:true, data:result,message: "profile photo was uploaded"})
};


export const uploadDocuments = async (req, res) => {
  const userId = req.params.uid;
  const files = req.files;

  if (!files || Object.keys(files).length === 0) {
    return res.status(400).send({ message: "No files were uploaded." });
  }

  const existingDocuments = user.documents || [];

  const documentMap = existingDocuments.reduce((map, doc) => {
    map[doc.name] = doc;
    return map;
  }, {});
  const fileFields = [
    "identification",
    "proofOfResidence",
    "accountStatement",
  ];

  fileFields.forEach((field) => {
    if (files[field]) {
      files[field].forEach((file) => {
        if (documentMap[field]) {
          documentMap[field] = {
            name: field,
            originalname: file.originalname,
            reference: file.path,
          };
        } else {
          documentMap[field] = {
            name: field,
            originalname: file.originalname,
            reference: file.path,
          };
        }
      });
    }
  });

  const updatedDocuments = Object.values(documentMap);

  if (updatedDocuments.length > 0) {
    const updateData = {
      $set: {
        documents: updatedDocuments,
      },
    };

    const result = await usersRepository.updateUserBy({ _id: userId }, updateData);
    const userDto = await UserDTO.getUserResponseForRole(result, null, null);
    res.status(200).json({ succes: true, data: userDto });

  } else {
    res.status(404).json({succes:false,message:"No valid files"});
  }

};
