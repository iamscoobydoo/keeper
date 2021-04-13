require("dotenv").config({ path: "../.env" });
const express = require("express");
const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");
const User = require("../../models/User");

const router = express.Router();

//@route    GET api/notes
//@desc     Get a user's notes
//@access   Private
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ msg: "User does not exists" });

        const notes = user.notes;
        return res.json(notes);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server error");
    }
});

//@route    PUT api/notes
//@desc     Add a note
//@access   Private
router.put("/", [auth, [check("title", "Title is empty").not().isEmpty()]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        //todo more
    }
    try {
        const user = await User.findById(req.user.id).select("-password");
        user.notes.push({ title: req.body.title, content: req.body.content });
        await user.save();
        return res.json(user.notes);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server error");
    }
});

//@route    DELETE api/notes/:id
//@desc     Delete a note
//@access   Private
router.delete("/:noteId", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ msg: "User does not exists" });

        //get the note from the notes array
        const note = user.notes.find((note) => note.id === req.params.noteId);
        if (!note) return res.status(404).json({ msg: "Note not found!" });

        //get remove index
        const removeIndex = user.notes.map((note) => note.id.toString()).indexOf(req.params.noteId);

        user.notes.splice(removeIndex, 1);

        await user.save();
        return res.json(user.notes);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server error");
    }
});

module.exports = router;
