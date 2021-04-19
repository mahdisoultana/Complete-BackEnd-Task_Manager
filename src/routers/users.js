const express = require("express");
const router = new express.Router();
const Auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const { SendEmail } = require("../email/gmailTest");
///MongoDB Mongoose Modals
const Users = require("../models/users");
//////Create User Rest API
router.post("/users", async (req, res) => {
  const keysBody = Object.keys(req.body);
  const keyforUpdate = ["name", "email", "password"];
  const isValidUpdate = keysBody.every(key => {
    return keyforUpdate.includes(key);
  });
  if (!isValidUpdate) {
    return res.status(400).send({ error: "This Key Not Valid" });
  }
  try {
    const User = new Users(req.body);
    const user = await User.save();
    const token = await user.GenerateToken();
    SendEmail(user.email, user.name);
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});
//Loggin User
router.post("/user/login", async (req, res) => {
  let password = req.body.password;
  let email = req.body.email;

  try {
    const user = await Users.findCridential(email, password);
    const token = await user.GenerateToken();
    res.send({ user, token });
  } catch (e) {
    res.status(404).send("Unable to Loggin " + e);
  }
});

//Read Users from Mongoose

router.get("/users/me", Auth, async (req, res) => {
  try {
    res.status(201).send(req.user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//LogOut Users from Mongoose

router.post("/user/loggout", Auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      tokens => tokens.token != req.token
    );
    await req.user.save();
    res.status(201).send("Your LoggOut");
  } catch (e) {
    res.status(400).send(e.message);
  }
});
//LogOut User All from Mongoose

router.post("/user/loggoutall", Auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(201).send("Your LoggOut from All Devices");
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// //Read User By Its ID

// router.get("/user/:id", async (req, res) => {
//   try {
//     const _id = req.params.id;
//     const user = await Users.findById(_id);
//     if (!user) {
//       return res.status(404).send("User Not Found with this Id " + _id);
//     }
//     res.send(user);
//   } catch (e) {
//     res.status(500).send("Internal Server Error");
//   }
// });
///DELETE USER BY ID

router.delete("/user/me", Auth, async (req, res) => {
  try {
    await req.user.remove();
    SendEmail(req.user.email, req.user.name, true);
    res.send(req.user);
  } catch (e) {
    res.status(500).send("Internal Server Error " + e);
  }
});

///Update User By ID
router.put("/user/me", Auth, async (req, res) => {
  const keysBody = Object.keys(req.body);
  const keyforUpdate = ["name", "email", "password"];
  const isValidUpdate = keysBody.every(key => keyforUpdate.includes(key));

  if (!isValidUpdate) {
    return res.status(400).send({ error: "This Key Not Valid" });
  }
  try {
    keysBody.forEach(update => (req.user[update] = req.body[update]));
    // for (const key in req.body) {
    //   user[key] = req.body[key];
    // }
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});
const avatar = multer({
  limits: {
    fileSize: 1_000_000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error("Please Upload Image JPG or png or jpeg !"));
    }
    cb(undefined, true);
  }
});
router.post(
  "/user/me/avatar",
  Auth,
  avatar.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.delete("/user/me/avatar", Auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();

  res.send("Avatar Deleted");
});
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error("Avatar not Found !");
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send({ error: e.message });
  }
});
module.exports = router;
