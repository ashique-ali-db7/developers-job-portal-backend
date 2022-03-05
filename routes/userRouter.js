const express = require("express");
const router = express.Router();
const userHelpers = require("../helpers/userHelper");
const adminHelpers = require("../helpers/adminHelper");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const superagent = require("superagent");
const nodemailer = require("nodemailer");
const env = require("../config/env");
const { response, Router } = require("express");
const { jwt_secert } = require("../config/env");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { uploadFile, getFileStream } = require("../utils/s3");
const fs = require("fs");

let currenetUserEmail = "";

function authenthicateToken(req, res, next) {
  const token = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN  bearer is a token format
  if (token === null) return res.sendStatus(401);

  jwt.verify(token, env.jwt_secert, (err, userid) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.userId = userid;
    next();
  });
}

router.route("/").get((req, res) => {});

router.route("/signup").post((req, res) => {
  currenetUserEmail = req.body.email;
  userHelpers.userSignupVerification(req.body).then((response) => {
    if (response.emailExist) {
      res.status(409);
      res.json({ message: "Entered user already exist" });
    } else {
      console.log("kkk");
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: env.userEmail,
          pass: env.mailPassword,
        },
      });
      console.log(env.userEmail);
      console.log(env.mailPassword);
      let mailOptions = {
        from: env.userEmail,
        to: req.body.email,
        subject: "Developers hub",
        text: "Your otp verification number is " + response.otp,
      };

      transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.log("error occurs" + err);

          res.status(400);
          res.json({ message: "Invalid Email address" });
        } else {
          res.status(200);
          res.json({ message: "Email send succesfulyy" });

          console.log("email sent");
        }
      });
    }
  });
});

router.route("/otpVerification").post((req, res) => {
  userHelpers.otpVerification(req.body, currenetUserEmail).then((response) => {
    if (response.verification) {
      res.status(200);
      res.json({ message: "otp is correct" });
    } else {
      res.status(400);
      res.json({ message: "otp is not correct" });
    }
  });
});

router.route("/signin").post((req, res) => {
  userHelpers.siginCheck(req.body).then((response) => {
    if (response.exist) {
      res.status(200);
      res.json({ token: response.token, user: response.user });
    } else {
      res.status(404);
      res.json({ message: "Invalid user name or password" });
    }
  });
});

router.route("/googleVerification").post((req, res) => {
  let { email } = req.body;
  userHelpers.googleVerification(email).then((response) => {
    if (response.exist) {
      res.status(200);
      res.json({ token: response.token, user: response.user });
    } else {
      res.status(401);
      res.json({ message: "user does not exist" });
    }
  });
});

router
  .route("/profilePost")
  .post(upload.array("profileResulToBackend"), async (req, res) => {
    let files = req.files;
    const [profileImage, verificationImageUpload] = files;

    if (profileImage || verificationImageUpload) {
      const result = await uploadFile(files);

      if (fs.existsSync("./" + profileImage?.path)) {
        fs.unlink("./" + profileImage.path, function (err) {
          if (err) throw err;
          console.log("File deleted!");
        });
      }

      if (fs.existsSync("./" + verificationImageUpload?.path)) {
        fs.unlink("./" + verificationImageUpload.path, function (err) {
          if (err) throw err;
          console.log("File deleted!");
        });
      }
      delete req.body.profileResulToBackend;
      userHelpers
        .uploadProfile(
          req.body,
          result?.profileImage.Location,
          result.verificationImageUpload?.Location
        )
        .then((result) => {
          res.status(200);
          res.json(result);
        });
    } else {
      delete req.body.profileResulToBackend;
      userHelpers.uploadProfile(req.body).then((result) => {
        res.status(200);
        res.json(result);
      });
    }
  });
router.route("/allUsers").get((req, res) => {
  userHelpers.allUsers((users) => {
    res.status(200);
    res.send(users);
  }, req.query.number);
});
router.route("/paginationCount").get((req, res) => {
  userHelpers.paginationCount().then((response) => {
    console.log(response);
    res.status(200);
    res.json({ count: response });
  });
});
module.exports = router;
