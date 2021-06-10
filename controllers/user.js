const User = require("../models/user");
const bcrypt = require('bcrypt');

exports.registerUser = (req, res, next) => {
        const {fullName, username, email, phoneNumber, password, gender} = req.body;

        //TODO: Check propiedades!
        if(!fullName?.trim()) {
            throw new Error("Wrong params");
        }

        User.findOne({$or : [{email}, {phoneNumber}, {username}]})
            .then(userDoc => {
                if(userDoc) {
                    throw new Error("The email, phone number or username are repeated");
                }
                return bcrypt.hash(password, 12);
            })
            .then(hashedPassword => {
                const user = new User({fullName, username, email, phoneNumber, password : hashedPassword, gender});
                return user.save();    
            })
            .then(createdUser => createdUser)
            .then(user => res.status(201).json({message: "User registered!", ok : true, user}))
            .catch(({message}) => res.status(500).json({message, ok : false}));
    };

exports.loginUser = (req, res, next) => {
        
        const {username, password} = req.body;

        User.findOne({username : username})
            .then(user => {
                if(!user) {
                    throw new Error("The username doesn't exist");
                }
                bcrypt.compare(password, user.password)
                    .then(passwordMatch => {
                        if(!passwordMatch) {
                            throw new Error("The password isn't correct");
                        }
                        console.log(user);
                        res.status(201).json({message : "User logged", user, ok : true});
                    })
            })
            .catch(({message}) => res.status(500).json({message, ok : false}));
    };
