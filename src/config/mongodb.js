const mongoose = require('mongoose');

const URL = 'mongodb+srv://Sockeep:8898@cluster0.gurzo.mongodb.net/Sockeep?retryWrites=true&w=majority';

// database mongodb setting
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
};

// // mongoDB_localhost
// const connectDB = mongoose.connect('mongodb://localhost:27017/Sockeep', options, (err) => {
//     var messenger = (err == null ? 'Successfully connected' : 'Failed to connect');
//     console.log(messenger); 
// });

// mongoDB_Server
const connectDB = mongoose.connect(URL, options, (err) => {
    var messenger = (err == null ? 'Successfully connected' : 'Failed to connect');
    console.log(messenger); 
});



module.exports.connectDB = connectDB;