const express = require("express");
const Task = require("../models/Task");

const router = express.Router();


// ===============================
// CREATE A NEW TASK
// ===============================

router.post("/", async (req, res) => {

    try {

        const task = new Task(req.body);

        const savedTask = await task.save();

        res.status(201).json({

            success: true,

            message: "Task created successfully",

            task: savedTask

        });

    } catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

});


// ===============================
// GET ALL TASKS
// ===============================

router.get("/", async (req, res) => {

    try {

        const tasks = await Task
            .find()
            .populate("assignedTo", "name email role")
            .populate("projectId", "name")
            .sort({ createdAt: -1 });


        res.json({

            success: true,

            tasks

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

});


module.exports = router;