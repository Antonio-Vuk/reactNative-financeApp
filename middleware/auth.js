const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(401).send("Access denied. No token provided");
    }

    try {
        const decoded = jwt.verify(token, "jwtPrivateKey");
        req.user = decoded;
        next();
    } catch (ex) {
        return res.status(400).send("Invalid token.");
    }
};

module.exports = auth;
