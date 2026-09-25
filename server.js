const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const projectRoutes = require("./routes/projectRoutes");
const memberRoutes = require("./routes/memberRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/projects", projectRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "ProjectFlow server is running!"
    });
});


// ===============================
// START SERVER
// ===============================

async function startServer() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {

            console.log(
                `ProjectFlow running on port ${PORT}`
            );

        });

    } catch (error) {

        console.error(
            "MongoDB connection failed:"
        );

        console.error(error.message);

    }

}


// ===============================
// START ONLY WHEN RUN DIRECTLY
// ===============================

if (require.main === module) {

    startServer();

}


// ===============================
// EXPORT APP FOR TESTING
// ===============================

module.exports = app;