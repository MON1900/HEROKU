const passport = require('passport');
const FBStrategy = require('passport-facebook').Strategy;

module.exports = passport.use(new FBStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'email', 'name'],
    passReqToCallback: true
}, (req,_,__,profile, done) => {
    try{
        if(profile){
            req.userProfile = profile;
            done(null, profile);
        }
    } catch (error){
        done(error);
    } 
}));