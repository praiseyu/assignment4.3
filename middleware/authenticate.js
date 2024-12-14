const jwt = require('jsonwebtoken');
const knex = require("knex")(require("../knexfile"));

async function authenticateToken(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: 'Authorization header is missing.' });
    }

    const token = authorization.split(" ")[1];

    try {
        const { email } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await knex("users").select("id", "email", "name").where({ email }).first();
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid or expired token." });
    }
}

module.exports = authenticateToken;