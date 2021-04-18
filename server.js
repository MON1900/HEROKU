require('dotenv').config({path: '.env'});
require('./src/config/mongodb');
var path = require('path');
var cors = require('cors');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session')

const PORT = process.env.PORT || 3000;


var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const corsOptions ={
    origin: 'https://sockeep.com',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 400,
}
app.use(cors(corsOptions));

app.set("trust proxy", 1);

// app.use((req, res, next) => {
//     const ALLOW_ORIGIN = [ 'http://localhost:4200', 'https://sockeep.com']                     
//     const ORIGIN = req.headers.origin                          
//     if (ALLOW_ORIGIN.includes(ORIGIN)) {
//     res.header('Access-Control-Allow-Origin', ORIGIN)
//     }
//     // res.header('Access-Control-Allow-Origin', 'https://sockeep.com')
//     res.header('Access-Control-Allow-Methods','POST, GET, PUT, PATCH, DELETE, OPTIONS')
//     res.header('Access-Control-Allow-Headers','Content-Type, Option, Authorization, X-Session-Id')
//     next()
// })

app.use('/api/auth', require('./src/routes/auth.route'));
app.use('/api/user', require('./src/routes/user.route'));
app.use('/api/basket', require('./src/routes/basket.route'));

app.get("/", (req, res)=>{
    res.json({messeng: "Welcome to Sockeep Server >>>"});
})

app.listen( PORT , () => {
    console.log(`Server is Runing. ${PORT}`);
});
