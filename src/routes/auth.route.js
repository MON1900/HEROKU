const express = require('express');
// const passport = require('../utils/passport');
const { authJwt, verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");


const router = express.Router();

router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.post('/signup',
    [
        verifySignUp.checkDuplicateEmail
        // verifySignUp.checkRolesExisted
    ],
  controller.signup
);

router.post("/signin", controller.signin);

router.post("/signinFacebook", controller.signinFacebook);

router.post("/signout", [authJwt.verifyToken], controller.signout);

router.post("/keyEmail", controller.keyEmail);
router.post("/resetPassword", controller.resetPassword);

// // Facebook login route
// router.get('/facebook', passport.authenticate('facebook'));
// // Facebook callback route
// router.get('/facebook/callback', passport.authenticate('facebook', {
//   session: false,
//   failureRedirect: 'http://localhost:4200/login',
//   scope: ['profile', 'email']
// }), controller.signinFacebook);

module.exports = router;