const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const jwtToken = req.headers.authorization.split(" ")[1];
    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).json({ status: "failed", message: "You are not authorized to perform this action." });
        } else if ( req.body.email !== decoded.email ) {
            res.status(401).json({ status: "failed", message: "You are not authorized to perform this action." });
        }

        res.status(200).json({ status: "success", message: "You are authorized to perform this action.", data: decoded });
    });
    
    next();
};
