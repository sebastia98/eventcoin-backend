const User = require("../models/user");

exports.registerUser = (req, res, next) => {
    const {fullName, username, email, phoneNumber, password, gender} = req.body;

    console.log(req.body, " => user");

    //TODO: Check propiedades!
    if(!fullName?.trim()) {
        throw new Error("Wrong params");
    }

    const user = new User({fullName, username, email, phoneNumber, password, gender});

    return user.save().then( (createdUser) => {
        res.status(201).json({message: "User registered!", 
                              user: createdUser});
        return createdUser;
    });

}