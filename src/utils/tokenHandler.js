const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

module.exports = {
    createToken: function(userId, tokenVersion) {
        return jwt.sign({ userId, tokenVersion}, process.env.COOKIE_SECRET, { expiresIn: '30 day'});
    },
    sendToken: function(res, token) {
        var date = 30;
        let options = {
            maxAge: 1000 * 60 * 60 * 24 * date, // would expire after 30 day
            httpOnly: false, // The cookie only accessible by the web server
            signed: false, // Indicates if the cookie should be signed
            sameSite: 'none',
            domain: '.herokuapp.com',
            secret: true,
            // resave: false,
            // saveUninitialized: false,
        }
        // res.cookie(process.env.COOKIE_NAME, token, options);
        jwt.verify(token, process.env.COOKIE_SECRET, async (err, data) => {
            if (err) {
              return res.status(401).send({message: "Unauthorized!"});
            }
            else{
                await userModel.findById(data.userId).then( async (user) => {
                    if(user){
                        // user.tokenVersion = user.tokenVersion+1;
                        // user.save();
                        res.cookie(process.env.COOKIE_NAME, token, options);
                        var authorities = [];
                        for (let i = 0; i < user.roles.length; i++) {
                            authorities.push("ROLE_" + user.roles[i].toUpperCase());
                        }
                        res.status(200).send({
                            id: user._id,
                            username: user.username,
                            email: user.email,
                            roles: authorities,
                            token: token
                        });
                    }
                }).catch(error => {
                    res.status(401).json({message: "Unauthorized!"});
                }); 
            }
        });
    },
    checkToken: function(req, res) {
       
        var token = req.cookies[process.env.COOKIE_NAME];
        if(token){
            return true;
            // return jwt.verify(token, process.env.COOKIE_SECRET, async (err, data) => {
            // if (err) {return false;}
            //     var user = await userModel.findOne({_id : data.userId});
            //     if(data.tokenVersion === (user.tokenVersion-1)){
            //         return true;
            //     }
            //     else{return false;}
            // });
        }else{return false;}
    },
   
};
