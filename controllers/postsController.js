const knex = require("knex")(require("../knexfile"));
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function getAllPosts(req, res) {
    try {
        const posts = await knex("posts")
            .join("users", "posts.user_id", "=", "users.id")
            .select("posts.id", "posts.title", "posts.content", "users.name as author")
            .orderBy("posts.created_at", "desc");
        res.status(200).json(posts);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Error fetching posts" });
    }
}

async function getOnePostById(req, res) {
    const { postId } = req.params;
    try {
        const post = await knex("posts").where({ id: postId }).first();
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }
        res.status(200).json(post);
    } catch (err) {
        console.error(`Error fetching post with post id: ${postId}.`);
        res.status(500).json({
            error: `Error fetching post with post id: ${postId}.`
        });
    }

}
async function addNewPost(req, res) {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "user_id, title, and content are required." });
    }
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = decoded.email;
        const user = await knex("users").where({ email: userEmail }).first();
        const user_id = user.id;
        await knex("posts").insert({ user_id, title, content })
        res.status(201).json({ message: "Post created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while creating the post." });
    }
}

async function updatePost(req, res) {
    const { postId } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required." });
    }

    try {
        const post = await knex("posts").where({ id: postId }).first();

        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        await knex("posts")
            .where({ id: postId })
            .update({ title, content });

        res.status(200).json({ message: "Post updated successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while updating the post." });
    }
}

async function deletePost(req, res) {
    const { postId } = req.params;

    try {
        const post = await knex("posts").where({ id: postId }).first();

        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        await knex("posts").where({ id: postId }).del();

        res.status(200).json({ message: "Post deleted successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while deleting the post." });
    }
}


module.exports = { getAllPosts, addNewPost, updatePost, deletePost, getOnePostById }