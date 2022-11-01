const User = require('../models/Users');
const bcrypt = require('bcrypt');

// GET all users
const getAll = (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            res.status(404).json({ status: "failed", message: "Something has gone wrong.", error: err });
        }
        res.status(200).json({ status: "success", message: "All users retrieved.", data: users });
    });
};

// GET one user
const getOne = (req, res) => {
    User.findOne( req.params.id, (err, user) => {
        if (err) {
            res.status(404).json({ status: "failed", message: "Something has gone wrong.", error: err });
        }
        res.status(200).json({ status: "success", message: `Got data for user ${req.params.id}.`, data: user });
    });
};

// POST create user
const create = (req, res) => {
    User.create(req.body, (err, user) => {
        if (err) {
            res.status(404).json({ status: "failed", message: "Something has gone wrong.", error: err });
        }
        res.status(200).json({ status: "success", message: `You created a user called "${user.name}".`, data: user });
    });
};

// POST login user
const login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }, (err, user) => {
        if (err) {
            res.status(404).json({ status: "failed", message: "Something has gone wrong.", error: err });
        }
        if (!user) {
            res.status(404).json({ status: "failed", message: "User not found." });
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                res.status(404).json({ status: "failed", message: "Something has gone wrong.", error: err });
            }
            if (result) {
                res.status(200).json({ status: "success", message: `You logged in as "${user.name}".`, data: user });
            } else {
                res.status(404).json({ status: "failed", message: "Wrong password." });
            }
        });
    });
};

// DELETE remove user
const remove = (req, res) => {
    User.findByIdAndDelete(req.params.id, (err, user) => {
        if (err) {
            res.status(404).json({ status: "failed", message: "Something has gone wrong.", error: err });
        }
        res.status(200).json({ status: "success", message: `You deleted a user called "${user.name}".`, data: user });
    });
};

module.exports = { getAll, getOne, create, login, remove };

