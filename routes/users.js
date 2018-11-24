const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportjwt = require('passport-jwt');
const secret = require('../config/keys').secret
const User = require('../models/User');
const router = express.Router();


router.get('/', (req, res)=>{
    res.send("Welcome to Homepage");
});

router.get('/user/:name', (req, res)=>{
    let name = req.params.name;
    res.send("Welcome back " + name);
});

router.post('/register-survey', (req, res)=>{
    const newUser = new User(req.body);

    newUser.save()
    .then((user)=>{ // After save
        res.json(user); // Respond to the client
    })
    .catch((err)=>{ // If save does not work
        console.log('error is', err); // Tell is what happened
    });
});


router.post('/register-user', (req, res)=>{

    // Check database for new email address
    User.findOne({ email: req.body.email})
    .then(user=>{
        // If email is taken, inform the user
        if(user) {
            res.send({
                message: "User already exists"
            });
        } 
        // Otherwise save the new user's information
        else {
           const newUser = new User({
               name: req.body.name,
               email: req.body.email,
               password: req.body.password
           });

           // Have bcrypt generate a salt; that is, extra data to add to hash for complexity
           bcrypt.genSalt(10, (err, salt)=>{
                // Add the generated salt to the hash
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    // Change the users password to the hash
                    newUser.password = hash;
                    // Save the users info with hashed password
                    newUser
                    .save()
                    .then(user=>res.send(user))
                    .catch(err=>console.log(err));
                });
           })
        }
    })
});

router.post('/login', (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    // Check to see if the email exists in database
    User.findOne({email}).then(user=>{

        // If it does not exist
        if(!user){
            res.send({
                message: "A user with that email does not exist"
            });
        
        // Email exists. Let's verify the password
        } else {

            // Compare login password with the password in database
            // after decryption
            bcrypt.compare(password, user.password)
            .then(isMatch=>{
                if(isMatch) {

                    const payload = {id: user.id, name: user.name};
                    // jwt.sign() needs 4 arguments
                    jwt.sign(
                        payload, // payload
                        secret, //secret 
                        {expiresIn: 3600}, // session time limit 
                        (err, token)=>{ //callback
                            res.send({
                                message: "User is logged in",
                                token: 'Bearer ' + token,
                                name: user.name
                            })
                        }
                    );
                } else {
                    res.send({
                        message: "Incorrect login information"
                    })
                }
            });
        }
    });
});

// The private route
router.get(
    '/dashboard', 
    passport.authenticate('jwt', {session: false}), 
    (req, res)=>{
    res.send({
        myFriends: [
            {
                name: "Jimmy",
                location: "Canada"
            },
            {
                name: "Amy",
                location: "Dubai"
            },
            {
                name: "Sanjay",
                location: "UK"
            }
        ]
    })
});

router.all('*', (req, res)=>{
    res.send('404. Page does not exist');
});


module.exports = router;