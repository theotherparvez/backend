// Import all the requirements here...
const express = require('express'); // Import express into the file
const mongoose = require('mongoose'); // Import mongoose into the file
const bodyParser = require('body-parser'); // Import body-parser
const cors = require('cors'); // Import CORS (Cross-Origin Resource-Sharing)
const routes = require('./routes/users');
const bcryptjs = require('bcryptjs');
const passport = require('passport');
const passportJwt = require('passport-Jwt');
const jwt = require('jsonwebtoken');

const server = express(); // Make a new express server
server.use(cors());
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
server.use('/', routes);
server.use(passport.initialize());


const dbURL = 'mongodb://astrolabsuser:abc123@ds139243.mlab.com:39243/astrolabs';

mongoose.connect(dbURL, {useNewUrlParser: true}); //Database configuration
mongoose.connection.once('open', ()=>{  
    console.log("Database is connected, biznatch!");
})


server.listen(4000, ()=>{
    console.log("Server is running at http://localhost:4000/, BITCHEZZ!")
});






/**
 * How .get() works...
 * server.get(route, function)
 */


