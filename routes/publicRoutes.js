const router = require("express").Router();
const authController = require("../controllers/authController");
const { body } = require("express-validator");
const validateRequestSchema = require("../middleware/validateRequestSchema");

router.route("/").get(authController.getHomePage);
router.route("/dashboard").get(
    authController.getDashboardPage
);

router.route("/signup")
    .get(authController.getSignupPage)
    .post(body("email").isEmail(),
        body("name").exists({ checkFalsy: true }),
        body("password").isLength({ min: 8 }),
        validateRequestSchema, authController.addNewUser);

router.route("/login")
    .get(authController.getLoginPage)
    .post(body("email").isEmail(),
        body("password").isLength({ min: 8 }),
        validateRequestSchema,
        authController.loginUser
    );

module.exports = router;