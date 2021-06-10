const User = require("../models/user");
const bcrypt = require('bcrypt');

exports.registerUser = (req, res, next) => 
new Promise((resolve, reject) => {

    const {fullName, username, email, phoneNumber, password, gender} = req.body;

    //TODO: Check propiedades!
    if(!fullName?.trim()) {
        throw new Error("Wrong params");
    }

    User.findOne({$or : [{email}, {phoneNumber}, {username}]})
        .then(userDoc => {
            if(userDoc) {
                throw new Error("Wrong params");
            }
            return bcrypt.hash(password, 12);
        })
        .then(hashedPassword => {
            const user = new User({fullName, username, email, phoneNumber, password : hashedPassword, gender});
            return user.save();    
        })
        .then((createdUser) => createdUser)
        .then(user => resolve(res.status(201).json({message: "User registered!", user})))
        .catch(({message}) => reject(res.status(500).json({message, ok : false})));
})