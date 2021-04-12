require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

//connect to db
connectDB();

//initialise middleware
app.use(express.json({ extended: false }));

//define routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/user", require("./routes/api/user"));
app.use("/api/notes", require("./routes/api/notes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
