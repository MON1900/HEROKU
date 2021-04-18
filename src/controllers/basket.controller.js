const basketModel = require('../models/basket.model');


exports.getBasket = async (req, res) => {
    res.status(200).send(req);
    // res.json(await basketModel.find());
};

exports.getItemProduct = async (req, res) => {
    res.json(await basketModel.find( {userId : req.userId} ));
};

exports.addItemProduct = (req, res) => {

    var isArrays = Array.isArray(req.body.id);
    if(isArrays){req.body.id.forEach(data => {data.userId = req.userId;});}
    else{req.body.id.userId = req.userId;}

    basketModel.insertMany(req.body.id, { $set: { "userId" : "123456789" } }).then((user) => {
        res.json(user);
    }).catch(error => {
        res.status(500).json({ message: 'Insert not found!'});
    }); 
};

exports.deleteItemProduct = (req, res) => {
    basketModel.findByIdAndDelete(req.body.id).then((user) => {
        res.json({ message: 'delete success'});
    }).catch(error => {
        res.status(500).json({ message: 'delete not found!'});
    }); 
};