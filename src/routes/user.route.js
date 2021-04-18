const express = require('express');
const { authJwt, verifySignUp } = require("../middleware");
const controller = require("../controllers/user.controller");

const router = express.Router();

router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});


router.get('/', [authJwt.verifyToken], controller.allAccess);

router.get('/getUser', [authJwt.verifyToken, authJwt.isClient], controller.userBoard);

module.exports = router;
