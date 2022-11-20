const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// GET all users
const getAll = (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            res.status(404).json({ status: "failed", message: "Something has gone wrong.", devMessage: "Something went wrong looking for users in the database (getAll function)", error: err });
        }
        if (!users) {
            res.status(404).json({ status: "failed", message: "There are no users or no collection called 'user'." });
        }
        res.status(200).json({ status: "success", message: "All users retrieved.", data: users });
    });
};

// GET one user
const getOne = (req, res) => {
    if(!req.params.id) {
        res.status(404).json({ status: "failed", message: "No id was provided.", devMessage: "Please provide an id in the url" });
    }

    User.findOne( req.params.id, (err, user) => {
        if (err) {
            res.status(404).json({ status: "failed", message: "This user could not be found.", devMessage: "Something went wrong looking for the user in the database (getOne function)", error: err });
        }
        if (!user) {
            res.status(404).json({ status: "failed", message: "There was no user found with this id." });
        }
        res.status(200).json({ status: "success", message: `Got data for user ${req.params.id}.`, data: user });
    });
};

// POST create user
const create = (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    
    if (!firstname || !lastname || !email || !password) {
        res.status(404).json({ status: "failed", message: "Please fill in all fields.", devMessage: " This route requires firstname, lastname, email and password" });
    } else if (password.length < 8) {
        res.status(404).json({ status: "failed", message: "Password must be at least 8 characters long.", devMessage: "Please require the password to be 8 chars at least in the frontend :)" });
    }
    
    User.findOne({ email }, (err, user) => {
        if (err) {
            res.status(404).json({ status: "failed", message: "Something has gone wrong.", devMessage: "Something went wrong looking for the user in the database (create error)", error: err });
        }
        if (user) {
            res.status(404).json({ status: "failed", message: "This email is already in use.", devMessage: "This email is already in use." });
        }

        User.create({ firstname, lastname, email, password }, (err, user) => {
            if (err) {
                res.status(404).json({ status: "failed", message: "Something has gone wrong.", devMessage: "Something went wrong creating the user in the database (create error)", error: err });
            }
        });


        const newUser = new User({ firstname, lastname, email, password });
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                res.status(404).json({ status: "failed", message: "Something has gone wrong.", devMessage: "Something went wrong generating the salt", error: err });
            }

            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                    res.status(404).json({ status: "failed", message: "Something has gone wrong.", devMessage: "Something went wrong hashing the password", error: err });
                }
                newUser.password = hash;
                newUser.save()
                    .then(user => {
                        res.status(200).json({ status: "success", message: "User created successfully.", data: user });
                    })
                    .catch(err => {
                        res.status(404).json({ status: "failed", message: "Something has gone wrong.", devMessage: "Something went wrong saving the user to the database", error: err });
                    });
            });
        });
        
        
    });
};

// POST login user
const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(404).json({ status: "failed", message: "Please fill in all fields.", devMessage: " This route requires email and password" });
    }

    User.findOne({ email }, (err, user) => {
        if (err) {
            res.status(404).json({ status: "failed", message: "Something has gone wrong.", devMessage: "Something went wrong looking for the user in the database (login error)", error: err });
        }
        if (!user) {
            res.status(404).json({ status: "failed", message: "This email is not registered.", devMessage: "This email is not registered. or you're usig the wrong email" });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                res.status(404).json({ status: "failed", message: "Something has gone wrong.", devMessage: "Something went wrong comparing the password", error: err });
            }
            if (isMatch) {
                const jwtToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
                res.status(200).json({ status: "success", message: "Login successful.", data: user, token: jwtToken });
            } else {
                res.status(404).json({ status: "failed", message: "Password incorrect.", devMessage: "Password the user gave is incorrect." });
            }
        });
    });
};

// DELETE remove user
const remove = (req, res) => {
    const { id } = req.params;

    if(!id) {
        res.status(404).json({ status: "failed", message: "No id was provided.", devMessage: "Please provide a userId in the url" });
    }

    User.findOneAndDelete( id, (err, user) => {
        if (err) {
            res.status(404).json({ status: "failed", message: "Something has gone wrong.", devMessage: "Could not get the user and remove them (remove function)", error: err });
        }
        res.status(200).json({ status: "success", message: `You deleted a user called "${user.name}".`, data: user });
    });
};

module.exports = { getAll, getOne, create, login, remove };

