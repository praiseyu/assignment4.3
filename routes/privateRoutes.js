const router = require("express").Router();
const authenticateToken = require("../middleware/authenticate");
const postsController = require("../controllers/postsController");
const authController = require("../controllers/authController");

router.use(authenticateToken);

router.get("/auth", (req, res) => {
    res.status(200).json({ message: "Authenticated" });
});

router.route("/userinfo").get(authController.getUserDetails);

router.route("/posts")
    .get(postsController.getAllPosts)
    .post(postsController.addNewPost);

router.route("/posts/:postId")
    .get(postsController.getOnePostById)
    .put(postsController.updatePost)
    .delete(postsController.deletePost);

module.exports = router;