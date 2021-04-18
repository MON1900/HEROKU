const mongoose = require('mongoose');
const enums = require('../config/enum');

const basketSchema = mongoose.Schema({
    userId: {type:String, default:null},
    urlImg: {type:String, default:null},
    detail: {type:String, default:null},
    color: {type:String, default:null},
    size: {type:String, default:null},
    price: {type:Number, default:0},
    CrDate: {type:Date, default:Date.now},
    UpdDate: {type:Date, default:Date.now},
}, {
    versionKey: false
});

module.exports = mongoose.model('basket', basketSchema);