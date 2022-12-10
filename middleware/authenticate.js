// Define imports
const User = require('../models/User');
const jwt = require("jsonwebtoken");

// Create a middleware function to check if the user is authenticated (has the correct token and email)
module.exports = (req, res, next) => {
    // Check if there is a token in the request
    if(!req.headers.authorization) {
        return res.status(401).json({ status: "failed", message: "You are not authorized to access this resource." });
    }

    // Get the token from the request header
    const jwtToken = req.headers.authorization.split(" ")[1];
    if (!jwtToken) {
        return res.status(401).json({ status: "failed", message: "Unauthorized" });
    }

    // Verify the token with built in jwt.verify() method 
    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).json({ status: "failed", message: "You are not authorized to perform this action." });
        }

        // If the token is valid, check if the user exists in the database
        User.findOne({ email: decoded.email }, (err, user) => {
            if (err) {
                res.status(401).json({ status: "failed", message: "You are not authorized to perform this action." });
            }

            if(!user) {
                res.status(401).json({ status: "failed", message: "You are not authorized to perform this action." });
            }
        });
    });
    
    // Call next() to continue with the request
    next();
};
