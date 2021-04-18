const userModel = require('../entities/user');
const tokenHandler = require('../utils/tokenHandler');

module.exports = {
    authentication: async function(req, res) {
        var token = req.cookies[process.env.COOKIE_NAME];

        if(token !== undefined){
            var verifyToken = tokenHandler.verifyToken(token);
            if(verifyToken !== undefined){
                var user = await userModel.findOne({_id : verifyToken.userId});
                if(verifyToken.tokenVersion === user.tokenVersion){

                    // Extend the token service if used more than 15 days.
                    if(Date.now()/1000 - verifyToken.iat > 60 * 60 * 24 * 15){
                        const userId = await userModel.findById(verifyToken.userId);
                        userId.tokenVersion = userId.tokenVersion+1;
                        userId.save();
                        // New token to client
                        var token = tokenHandler.createToken(verifyToken.userId, userId.tokenVersion);
                        tokenHandler.sendToken(res, token);
                    }
                    return user;
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }
};