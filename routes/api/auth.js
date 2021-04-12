require("dotenv").config({ path: "../.env" });
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");
const User = require("../../models/User");

const router = express.Router();

//@route    GET api/auth
//@desc     Return current user details from jwt token
//@access   Public
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        return res.json(user);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server Error");
    }
});

//@route    POST api/auth
//@desc     Authenticate or Login user and get token
//@access   Public
router.post(
    "/",
    [
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Password is required").exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    errors: [{ msg: "Invalid credentials" }],
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    errors: [{ msg: "Invalid credentials" }],
                });
            }

            //return jwt
            const payload = {
                user: {
                    id: user.id,
                },
            };
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
                if (err) throw err;
                return res.json({ token });
            });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server Error!");
        }
    }
);

module.exports = router;
