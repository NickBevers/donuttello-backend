// Define imports
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// GET all users
const getAll = (req, res) => {
    User.find({}, {_id: 0, password: 0, date: 0}, (err, users) => {
        // If there is an error, return the error
        if (err) {
            res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong looking for users in the database (getAll function)", error: err });
        }

        // If there are no users, return a message
        if (!users) {
            res.status(404).json({ status: "failed", message: "There are no users or no collection called 'user'." });
        }

        // If there are users, return them
        res.status(200).json({ status: "success", message: "All users retrieved.", data: users });
    }).select('-__v');
};

// GET one user
const getOne = (req, res) => {
    // Check if there is an id in the request
    if(!req.params.id) {
        res.status(404).json({ status: "failed", message: "Please provide an id of the user you want to get.", devMessage: "Please provide an id in the url" });
    }

    // Find the user with the id
    User.findOne( req.params.id, { _id: 0, password: 0, date: 0 }, (err, user) => {
        // If there is an error, return the error
        if (err) {
            res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong looking for the user in the database (getOne function)", error: err });
        }

        // If there is no user, return a message
        if (!user) {
            res.status(404).json({ status: "failed", message: "There was no user found with this id." });
        }

        // If there is a user, return it
        res.status(200).json({ status: "success", message: `Got data for user ${user.firstname} ${user.lastname}.`, data: user });
    }).select('-__v');
};

// POST create user (only for development as users will be static)
const create = (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    
    // Check if all fields are filled in
    if (!firstname || !lastname || !email || !password) {
        res.status(404).json({ status: "failed", message: "Please fill in all fields.", devMessage: " This route requires firstname, lastname, email and password" });
    } else if (password.length < 8) { // Check if password is longer than 8 characters
        res.status(404).json({ status: "failed", message: "The password must be at least 8 characters long.", devMessage: "Please require the password to be 8 chars at least in the frontend :)" });
    }
    
    // Get the user with the email
    User.findOne({ email }, { _id: 0, password: 0, date: 0 }, (err, user) => {
        // If there is an error, return the error
        if (err) {
            res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong looking for the user in the database (create error)", error: err });
        }

        // If there is a user, return a message
        if (user) {
            res.status(404).json({ status: "failed", message: "This email is already in use.", devMessage: "This email is already in use." });
        }

        // Create a new user
        const newUser = new User({ firstname, lastname, email, password });
        bcrypt.genSalt(10, (err, salt) => {
            // If there is an error, return the error
            if (err) {
                res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong generating the salt", error: err });
            }

            // Hash the password
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                // If there is an error, return the error
                if (err) {
                    res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong hashing the password", error: err });
                }

                // Set the password to the hashed password
                newUser.password = hash;

                // Save the user
                newUser.save()
                    .then(user => {
                        res.status(200).json({ status: "success", message: "User created successfully.", data: user });
                    })
                    .catch(err => {
                        res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong saving the user to the database", error: err });
                    });
            });
        });
        
        
    }).select('-__v');
};

// POST login user (admin panel/section only)
const login = (req, res) => {
    const { email, password } = req.body;

    // Check if all fields are filled in
    if (!email || !password) {
        res.status(404).json({ status: "failed", message: "Please fill in all the fields.", devMessage: " This route requires email and password" });
    }

    // Get the user with the email
    User.findOne({ email }, { _id: 0, date: 0 }, (err, user) => {
        // If there is an error, return the error
        if (err) {
            res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong looking for the user in the database (login error)", error: err });
        }

        // If there is no user, return a message
        if (!user) {
            res.status(404).json({ status: "failed", message: "This email is not registered yet.", devMessage: "This email is not registered. or you're usig the wrong email" });
        }

        // Check if the password is correct
        bcrypt.compare(password, user.password, (err, isMatch) => {
            // If there is an error, return the error
            if (err) {
                res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong comparing the password", error: err });
            }

            // If the password is correct, create a token and return a message
            if (isMatch) {
                const jwtToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
                res.status(200).json({ status: "success", message: "Login successful.", data: user, token: jwtToken });
            } else {
                res.status(404).json({ status: "failed", message: "This password does not match, please try again.", devMessage: "Password the user gave is incorrect." });
            }
        });
    }).select('-__v');
};


// PUT update user (admin panel/section only)
const resetPassword = (req, res) => {
    const { email, passwordOld, passwordNew } = req.body;
    const token = req.headers.authorization.split(" ")[1];

    // Check if all fields are filled in
    if (!email || !passwordOld || !passwordNew) {
        res.status(404).json({ status: "failed", message: "Please fill in all the fields.", devMessage: " This route requires email and password" });
    }

    // Check if the token is valid
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        // If there is an error, return the error
        if (err) {
            res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong verifying the token", error: err });
        }

        // Get the user with the email
        User.findOne({ email: decoded.email }, { _id: 0, date: 0 }, (err, user) => {
            // If there is an error, return the error
            if (err) {
                res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong looking for the user in the database (reset password error)", error: err });
            }

            // If there is no user, return a message
            if (!user) {
                res.status(404).json({ status: "failed", message: "This email is not registered yet.", devMessage: "This email is not registered. or you're usig the wrong email" });
            }
            
            // compare the password with the password in the database
            bcrypt.compare(passwordOld, user.password, (err, isMatch) => {
                // If there is an error, return the error
                if (err) {
                    res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong comparing the password", error: err });
                }

                // If the password is correct, create a token and return a message
                if (isMatch) {
                    bcrypt.genSalt(10, (err, salt) => {
                        // If there is an error, return the error
                        if (err) {
                            res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong generating the salt", error: err });
                        }

                        // Hash the password
                        bcrypt.hash(passwordNew, salt, (err, hash) => {
                            // If there is an error, return the error
                            if (err) {
                                res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong hashing the password", error: err });
                            }

                            // Set the password to the hashed password
                            User.updateOne({ email: decoded.email }, { $set: { password: hash } }, (err, user) => {
                                // If there is an error, return the error
                                if (err) {
                                    res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong updating the password", error: err });
                                }

                                // If there is no user, return a message
                                if (!user) {
                                    res.status(404).json({ status: "failed", message: "This email is not registered yet.", devMessage: "This email is not registered. or you're usig the wrong email" });
                                }

                                // Return a message
                                res.status(200).json({ status: "success", message: "Password updated successfully.", data: user });
                            });
                        });
                    });
                }
            });
        }).select('-__v');
    });
};

// DELETE remove user (only for development as users will be static and probably will not change often)
const remove = (req, res) => {
    // Check if there is an id in the request
    const { id } = req.params;

    // If there is no id, return a message
    if(!id) {
        res.status(404).json({ status: "failed", message: "Please provide the id of the user you want to remove.", devMessage: "Please provide a userId in the url" });
    }

    // Find the user with the id and remove it
    User.findOneAndDelete( id, { password: 0, date: 0 }, (err, user) => {
        // If there is an error, return the error
        if (err) {
            res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Could not get the user and remove them (remove function)", error: err });
        }

        // If there is a user, return a message after deleting it
        res.status(200).json({ status: "success", message: `You deleted a user called "${user.firstname} ${user.lastname}".`, data: user });
    }).select('-__v');
};

module.exports = { getAll, getOne, create, login, resetPassword, remove };

