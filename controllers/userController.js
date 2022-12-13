// Define imports
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// GET all users
const getAll = (req, res) => {
    User.find({}, {_id: 0, password: 0, date: 0}, (err, users) => {
        // If there is an error, return the error
        if (err) {
            return res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong looking for users in the database (getAll function)", error: err });
        }

        // If there are no users, return a message
        if (!users) {
            return res.status(404).json({ status: "failed", message: "There are no users or no collection called 'user'." });
        }

        // If there are users, return them
        return res.status(200).json({ status: "success", message: "All users retrieved.", data: users });
    });
};

// GET one user
const getOne = (req, res) => {
    // Check if there is an id in the request
    if(!req.params.id) {
        return res.status(404).json({ status: "failed", message: "Please provide an id of the user you want to get.", devMessage: "Please provide an id in the url" });
    }

    // Find the user with the id
    User.findOne( req.params.id, { _id: 0, password: 0, date: 0 }, (err, user) => {
        // If there is an error, return the error
        if (err) {
            return res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong looking for the user in the database (getOne function)", error: err });
        }

        // If there is no user, return a message
        if (!user) {
            return res.status(404).json({ status: "failed", message: "There was no user found with this id." });
        }

        // If there is a user, return it
        return res.status(200).json({ status: "success", message: `Got data for user ${user.firstname} ${user.lastname}.`, data: user });
    });
};

// POST create user (only for development as users will be static)
const create = (req, res) => {
    const { firstname, lastname, username, email, password } = req.body;
    
    // Check if all fields are filled in
    if (!firstname || !lastname || !username || !email || !password) {
        return res.status(404).json({ status: "failed", message: "Please fill in all fields.", devMessage: " This route requires firstname, lastname, email and password" });
    } else if (password.length < 8) { // Check if password is longer than 8 characters
        return res.status(404).json({ status: "failed", message: "The password must be at least 8 characters long.", devMessage: "Please require the password to be 8 chars at least in the frontend :)" });
    }
    
    // Get the user with the email
    User.findOne({ username: username }, { _id: 0, password: 0, date: 0 }, (err, user) => {
        // If there is an error, return the error
        if (err) {
            return res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong looking for the user in the database (create error)", error: err });
        }

        // If there is a user, return a message
        if (user) {
            return res.status(404).json({ status: "failed", message: "This username is already in use.", devMessage: "This username is already in use." });
        }

        // Create a new user
        const newUser = new User({ firstname, lastname, email, username, password });
        bcrypt.genSalt(10, (err, salt) => {
            // If there is an error, return the error
            if (err) {
                return res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong generating the salt", error: err });
            }

            // Hash the password
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                // If there is an error, return the error
                if (err) {
                    return res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong hashing the password", error: err });
                }

                // Set the password to the hashed password
                newUser.password = hash;

                // Save the user
                newUser.save()
                    .then(user => {
                        return res.status(200).json({ status: "success", message: "User created successfully.", data: user });
                    })
                    .catch(err => {
                        return res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong saving the user to the database", error: err });
                    });
            });
        });
    });
};

// POST login user (admin panel/section only)
const login = (req, res) => {
    const { username, password } = req.body;

    // Check if all fields are filled in
    if (!username || !password) {
        return res.status(404).json({ status: "failed", message: "Please fill in all the fields.", devMessage: " This route requires username and password" });
    }

    // Get the user with the email
    User.findOne({ username: username }, { _id: 0, date: 0 }, (err, user) => {
        // If there is an error, return the error
        if (err) {
            return res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong looking for the user in the database (login error)", error: err });
        }

        // If there is no user, return a message
        if (!user) {
            return res.status(400).json({ status: "failed", message: "This username is not registered yet.", devMessage: "This username is not registered. or you're usig the wrong email" });
        }

        // Check if the password is correct
        bcrypt.compare(password, user.password, (err, isMatch) => {
            // If there is an error, return the error
            if (err) {
                return res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong comparing the password", error: err });
            }

            // If the password is correct, create a token and return a message
            if (isMatch) {
                const jwtToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
                return res.status(200).json({ status: "success", message: "Login successful.", data: user, token: jwtToken });
            } else {
                return res.status(404).json({ status: "failed", message: "This password does not match, please try again.", devMessage: "Password the user gave is incorrect." });
            }
        });
    });
};


// POST update user (admin panel/section only)
const resetPassword = (req, res) => {
    const { email, passwordOld, passwordNew } = req.body;

    // Check if all fields are filled in
    if (!email || !passwordOld || !passwordNew) {
        return res.status(404).json({ status: "failed", message: "Please fill in all the fields.", devMessage: " This route requires email and password" });
    }

    // Get the user with the email
    User.findOne({ email: email }, { _id: 0, date: 0 }, (err, user) => {
        // If there is an error, return the error
        if (err) {
            return res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong looking for the user in the database (reset password error)", error: err });
        }
        
        // If there is no user, return a message
        if (!user) {
            return res.status(404).json({ status: "failed", message: "This email is not registered yet.", devMessage: "This email is not registered. or you're usig the wrong email" });
        }
        
        // compare the password with the password in the database
        bcrypt.compare(passwordOld, user.password, (err, isMatch) => {
            // If there is an error, return the error
            if (err) {
                return res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong comparing the password", error: err });
            }
            
            // If the password is correct, create a token and return a message
            if (isMatch) {
                bcrypt.genSalt(10, (err, salt) => {
                    // If there is an error, return the error
                    if (err) {
                        return res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong generating the salt", error: err });
                    }

                    // Hash the password
                    bcrypt.hash(passwordNew, salt, (err, hash) => {
                        // If there is an error, return the error
                        if (err) {
                            return res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong hashing the password", error: err });
                        }

                        // Set the password to the hashed password
                        User.updateOne({ email: email }, { $set: { password: hash } }, (err, user) => {
                            // If there is an error, return the error
                            if (err) {
                                return res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Something went wrong updating the password", error: err });
                            }

                            // If there is no user, return a message
                            if (!user) {
                                return res.status(404).json({ status: "failed", message: "This email is not registered yet.", devMessage: "This email is not registered. or you're usig the wrong email" });
                            }

                            // Return a message
                            return res.status(200).json({ status: "success", message: "Password updated successfully.", data: user });
                        });
                    });
                });
            } else {
                return res.status(404).json({ status: "failed", message: "This password does not match the one in the database, please try again.", devMessage: "Password the user gave is incorrect." });
            }
        });
    });
};

const authenticate = (req, res) => {
    return res.status(200).json({ status: "success", message: "You are authenticated." });
};

/*
// DELETE remove user (only for development as users will be static and probably will not change often)
const remove = (req, res) => {
    // Check if there is an id in the request
    const { id } = req.params;

    // If there is no id, return a message
    if(!id) {
        return res.status(404).json({ status: "failed", message: "Please provide the id of the user you want to remove.", devMessage: "Please provide a userId in the url" });
    }

    // Find the user with the id and remove it
    User.findOneAndDelete( id, { password: 0, date: 0 }, (err, user) => {
        // If there is an error, return the error
        if (err) {
            return res.status(404).json({ status: "failed", message: "Something has gone wrong, please try again.", devMessage: "Could not get the user and remove them (remove function)", error: err });
        }

        // If there is a user, return a message after deleting it
        return res.status(200).json({ status: "success", message: `You deleted a user called "${user.firstname} ${user.lastname}".`, data: user });
    });
};*/

module.exports = { getAll, getOne, create, login, resetPassword, authenticate };

