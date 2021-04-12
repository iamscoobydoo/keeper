require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        });

        console.log("connected to DB!");
    } catch (err) {
        console.error(err.message);
        //Exit process on failure
        process.exit(1);
    }
};

module.exports = connectDB;
