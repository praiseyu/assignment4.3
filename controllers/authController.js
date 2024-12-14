const knex = require("knex")(require("../knexfile"));
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

function getHomePage(req, res) {
    res.sendFile(path.resolve("public", "views", "index.html"));
}

function getDashboardPage(req, res) {
    res.sendFile(path.resolve("public", "views", "dashboard.html"));
}

function getLoginPage(req, res) {
    res.sendFile(path.resolve("public", "views", "login.html"));
}

function getSignupPage(req, res) {
    res.sendFile(path.resolve("public", "views", "signup.html"));
}


async function getUserDetails(req, res) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = decoded.email;
        const user = await knex("users").where({ email: userEmail }).first();
        res.status(201).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while creating the post." });
    }
}

async function addNewUser(req, res) {
    const { name, email, password } = req.body;
    const encrypted = bcrypt.hashSync(password);

    try {
        await knex("users").insert({ name, email, password: encrypted });
        res.status(201).json({ success: true });
    } catch (err) {
        console.error(err.code);
        if (err.code === "ER_DUP_ENTRY") {
            res.status(400).send("Email already exists.");
        }
        else {
            res.status(500).send("Something went wrong. Try again.");
        }
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        const user = await knex("users").where({ email }).first();

        if (!user) {
            return res.status(400).send("Email is incorrect.");
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).send("Email or password is incorrect.");
        }

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
        res.json({ token });

    } catch (err) {
        res.status(401).send("Login failed.");
    }
}

module.exports = {
    addNewUser,
    loginUser,
    getLoginPage,
    getSignupPage,
    getHomePage,
    getDashboardPage,
    getUserDetails
}