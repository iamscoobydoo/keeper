require("dotenv").config({ path: "../.env" });
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const router = express.Router();

const User = require("../../models/User");

//@route    POST api/user
//@desc     Register user
//@access   Public
router.post(
    "/",
    [
        check("name", "Name is Empty").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, email, password } = req.body;
        try {
            //check if the user already exists
            let user = await User.findOne({ email });
            if (user) return res.status(400).json({ errors: [{ msg: "User already exists!" }] });
            user = new User({
                name,
                email,
                password,
            });
            //encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            //return user jwt
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
            res.status(500).send("Internal Server Error!");
        }
    }
);

module.exports = router;
