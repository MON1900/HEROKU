const express = require('express');
const { authJwt, verifySignUp } = require("../middleware");
const controller = require("../controllers/basket.controller");

const router = express.Router();

router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});


router.get('/', controller.getBasket);

router.get('/getItemProduct', [authJwt.verifyToken, authJwt.isClient], controller.getItemProduct);
router.post('/addItemProduct', [authJwt.verifyToken, authJwt.isClient], controller.addItemProduct);
router.post('/deleteItemProduct', [authJwt.verifyToken, authJwt.isClient], controller.deleteItemProduct);

module.exports = router;