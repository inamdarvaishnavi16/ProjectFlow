const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
            default: null
        },

        deadline: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: [
                "To Do",
                "In Progress",
                "Completed"
            ],
            default: "To Do"
        },

        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Task", taskSchema);