const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const userModel = require('../models/user.model');
const tokenHandler = require('../utils/tokenHandler');
const nodemailer = require('nodemailer');

exports.signup = async (req, res) => { 

  userModel.create({
    username: req.body.username,
    email: req.body.email.toLowerCase(),
    password: await bcrypt.hash(req.body.password, 10)
  }).then( (user) => {

    var token = tokenHandler.createToken(user._id, user.tokenVersion);
    tokenHandler.sendToken(res, token);
     
  }).catch(err => {
    res.status(500).json({ message: err.message });
  });

};


exports.signin = (req, res) => {

  userModel.findOne({
    email : req.body.email.toLowerCase()
  }).then( async (user) => {
  
    var checkToken = await tokenHandler.checkToken(req, res);
    if (checkToken) {return res.status(404).send({ message: "Already logged in." });}
    
    if (!user) {return res.status(404).send({ message: "User Not found." });}
    var passwordIsValid = await bcrypt.compare(req.body.password, user.password);
    if (!passwordIsValid) {return res.status(400).send({accessToken: null, message: "Password is invalid!"});}
    
    var token = tokenHandler.createToken(user.id, user.tokenVersion);
    tokenHandler.sendToken(res, token);

  }).catch(err => {
    res.status(500).send({ message: err.message });
  });

};

exports.signinFacebook = async (req, res) => {

  console.log(req.body);
  var checkToken = await tokenHandler.checkToken(req, res);
  if (checkToken) {return res.status(404).send({ message: "Already logged in." });}

  var facebookId = await userModel.findOne({facebookId : req.body.id}).then((user)=>{return user;});

  var email = null;
  if(req.body.email != null){
    email = await userModel.findOne({email : req.body.email}).then((user)=>{return user;});
  }

  console.log(facebookId, email);

  if(facebookId==null && email==null){
      await userModel.insert({
          facebookId: req.body.id,
      }).then((user) => {
          var user = user[0];
          var token = tokenHandler.createToken(user._id, user.tokenVersion);
          tokenHandler.sendToken(res, token);
 
      }).catch(error => {
          res.status(400).json({ message: 'Insert not found!'});
      });
      
  }
  // else if(facebookId!=null && email!=null){
  //   userModel.findOne({
  //     facebookId : req.body.id
  //   }).then( async (user) => {
  //     var token = tokenHandler.createToken(user._id, user.tokenVersion);
  //     tokenHandler.sendToken(res, token);
  //   }).catch(err => {
  //     res.status(400).send({ message: err.message });
  //   });
  // }
  // else if(facebookId!=null && email==null){
  //   userModel.findOne({
  //     facebookId : req.body.id
  //   }).then( async (user) => {
  //     if(req.body.email){ user.email = req.body.email; user.save();}
  //     var token = tokenHandler.createToken(user._id, user.tokenVersion);
  //     tokenHandler.sendToken(res, token);
  //   }).catch(err => {
  //     res.status(400).send({ message: err.message });
  //   });
  // }
  // else if(facebookId==null && email!=null){
  //   userModel.findOne({
  //     email : req.body.email
  //   }).then( async (user) => {
  //     user.facebookId = req.body.id; user.save();
  //     var token = tokenHandler.createToken(user._id, user.tokenVersion);
  //     tokenHandler.sendToken(res, token);
  //   }).catch(err => {
  //     res.status(400).send({ message: err.message });
  //   });
  // }


};


// const urlRedirect = process.env.URL_FRONTEND+'/login/logincb';
// exports.signinFacebook = async (req, res) => {

//   var checkToken = await tokenHandler.checkToken(req, res);
//   if (checkToken) {return res.status(201).redirect(urlRedirect);}

//   var userFacebook = await userModel.findOne({facebookId : req.user.id});
//   if(userFacebook){
//     var token = tokenHandler.createToken(userFacebook._id, userFacebook.tokenVersion);
//     tokenHandler.sendToken(res, token);
//     res.redirect(urlRedirect);
//   }
//   else{
//     await userModel.insertMany({
//         username: req.user.name.givenName+' '+req.user.name.familyName,
//         facebookId: req.user.id
//     }).then((user) => {
//         var token = tokenHandler.createToken(user[0]._id, user[0].tokenVersion);
//         tokenHandler.sendToken(res, token);
//         res.redirect(urlRedirect);
//     }).catch(error => {
//         res.status(200).json({ message: 'Insert not found!'});
//     });
//   }

// };

exports.signout = (req, res) => {
  if(!req.cookies.Sockeep){req.cookies.Sockeep = req.headers.authorization;}
  var token = req.cookies[process.env.COOKIE_NAME];
  var userVerify = jwt.verify(token, process.env.COOKIE_SECRET);
  userModel.findOne({
    _id : userVerify.userId
  }).then( async (user) => {
      // user.tokenVersion = user.tokenVersion+1;
      // user.save();

    // res.clearCookie(process.env.COOKIE_NAME);
    res.status(200).json({ message: 'logout success'});

  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
};

exports.keyEmail = (req, res) => {
  userModel.findOne({
    email : req.body.email.toLowerCase()
  }).then( async (user) => {
    
    if (!user) {return res.status(404).send({ message: "User Not found." });}
    else{
      var codeResetPassword = Math.floor(Math.random() * 8999) + 1000;
      var codeAgeResetPassword = Date.now() + 1000*60*5;
        await userModel.findOneAndUpdate({email: req.body.email}, {$set: {codeResetPassword, codeAgeResetPassword}}, { new: true}, function(err, result) {
          if (err) {res.send(err); return err;}
          if (result) {
            var transporter = nodemailer.createTransport({
              service: 'gmail',
                auth: {
                  user: 'Parinya.Phapha@gmail.com',
                  pass: 'Parinya8898'
                }
            }); 
            var mailOptions = {
              from: 'Parinya.Phapha@gmail.com',
              to: req.body.email,
              subject: 'Sending Email using Node.js',
              text: 'Sockeep: รหัส KeyCode \"'+result.codeResetPassword+'\" ใช้ในการรีเซ็ตรหัสผ่าน',
            };    
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                // console.log(error);
                return res.status(404).send({ message: error });
              } 
              else {
                // console.log('Email sent: ' + info.response);
                return res.status(200).json({ message: 'The KeyCode has been sent to \''+ req.body.email +'\' Your email already'});
              }
            });
          }
        });
    }
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
};

exports.resetPassword = (req, res) => {
  userModel.findOne({
    email : req.body.email.toLowerCase()
  }).then( async (user) => {

    if(Date.now() > user.codeAgeResetPassword){return res.status(404).send({ message: 'KeyCode expired!' });}
    if(Number(req.body.codeResetPassword) !== user.codeResetPassword){return res.status(404).send({ message: 'KeyCode is invalid!' });}

    var numbers = req.body.newPassword.split('');
    if(numbers.length < 4 || numbers.length > 128){return res.status(404).send({ message: 'Password must be more than 4 characters!' });}

    if(Date.now() <= user.codeAgeResetPassword && Number(req.body.codeResetPassword) === user.codeResetPassword){
      var password = await bcrypt.hash(req.body.newPassword, 10);
      await userModel.findOneAndUpdate({email: req.body.email}, {$set: {password}}, { new: true}, function(err, result) {
        if (err) {res.send(err); return err;}
        if (result) {
          res.status(200).send({ message: 'Changed password success' });
        }
      });
    }
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
};


