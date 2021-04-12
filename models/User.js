const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    notes: [
        {
            title: {
                type: String,
            },
            content: {
                type: String,
            },
        },
    ],
});

module.exports = User = mongoose.model("user", UserSchema);
