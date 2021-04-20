const mongoose = require('mongoose');
const enums = require('../config/enum');

const userSchema = mongoose.Schema({
    username: {type:String, default:null},
    birthday: {type:Date, default:null},
    phone: {type:String, default:null},
    address: {type:String, default:null},
    email: {type:String, default:null, index:true, sparse:true, trim:true, unique:true, lowercase: true},
    password: {type:String, default:null},
    tokenVersion: {type:Number, default:0},
    codeResetPassword: {type:Number, default:0},
    codeAgeResetPassword: {type:String, default:null},
    facebookId: {type:String, default:null},
    roles: {type:[String], enum: enums, default: enums.client},
    CrDate: {type:Date, default:Date.now},
    UpdDate: {type:Date, default:Date.now}
}, {
    versionKey: false
});

module.exports = mongoose.model('user', userSchema);