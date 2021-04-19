const jwt = require("jsonwebtoken");
const userModel = require('../models/user.model');
const tokenHandler = require('../utils/tokenHandler');
const enums = require('../utils/enum');


verifyToken = (req, res, next) => {

  if(!req.cookies.Sockeep){req.cookies.Sockeep = req.headers.authorization;}

  let token = req.cookies[process.env.COOKIE_NAME];
  if (!token) {
    return res.status(403).send({message: "No token provided!"});
  }
  
  jwt.verify(token, process.env.COOKIE_SECRET, async (err, userVerify) => {
    if (err) {
      return res.clearCookie(process.env.COOKIE_NAME).status(401).send({message: "Unauthorized!"});
    }

    req.userId = userVerify.userId;
    req.tokenVersion = userVerify.tokenVersion;
    
    await userModel.findOne({_id : userVerify.userId}).then( async (user) => {
      if(user){

        if(userVerify.tokenVersion === (user.tokenVersion)){
          // Extend the token service if used more than 15 days.
          if(((Date.now()/1000) - verifyToken.iat) > (60 * 60 * 24 * 15)){
            // New token to client
            res.clearCookie(process.env.COOKIE_NAME);
            // user.tokenVersion = user.tokenVersion+1;user.save();
            var token = tokenHandler.createToken(user.userId, user.tokenVersion);
            tokenHandler.sendToken(res, token);
          }
        }
        else{
          return res.clearCookie(process.env.COOKIE_NAME).status(401).send({message: "Unauthorized!"});
        }
      }
      }).catch(error => {
          res.status(200).json({ message: 'Insert not found!'});
      });

    next(); 
  });
};

isClient = async (req, res, next) => {

  const userId = await userModel.findById(req.userId);
  var isClient = userId.roles.includes(enums.client);
  if(isClient){
    next();
    return;
  }
  else{
    res.status(403).send({message: "Require Client Role!"});
    return;
  }
};

isItemEditor = async (req, res, next) => {
  const userId = await userModel.findById(req.userId);
  var isItemEditor = userId.roles.includes(enums.itemEditor);
  if(isItemEditor){
    next();
    return;
  }
  else{
    res.status(403).send({message: "Require itemEditor Role!"});
    return;
  }
};

isAdmin = async (req, res, next) => {
  const userId = await userModel.findById(req.userId);
  var isAdmin = userId.roles.includes(enums.admin);
  if(isAdmin){
    next();
    return;
  }
  else{
    res.status(403).send({message: "Require Admin Role!"});
    return;
  }
};

isSuperAdmin = async (req, res, next) => {
  const userId = await userModel.findById(req.userId);
  var isSuperAdmin = userId.roles.includes(enums.superAdmin);
  if(isSuperAdmin){
    next();
    return;
  }
  else{
    res.status(403).send({message: "Require superAdmin Role!"});
    return;
  }
};

const authJwt = {
  verifyToken: verifyToken,
  isClient: isClient,
  isAdmin: isAdmin,
  isItemEditor: isItemEditor,
  isSuperAdmin: isSuperAdmin
};


module.exports = authJwt;
