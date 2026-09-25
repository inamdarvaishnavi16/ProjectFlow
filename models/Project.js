const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        technology: {
            type: String,
            default: ""
        },

        startDate: {
            type: Date,
            required: true
        },

        deadline: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: [
                "Not Started",
                "In Progress",
                "Completed"
            ],
            default: "Not Started"
        },

        /* =================================================
           COLLABORATION FEATURE
           ================================================= */

        collaborationEnabled: {
            type: Boolean,
            default: false
        },

        skillsNeeded: {
            type: String,
            default: ""
        },

        interestedUsers: [
            {
                name: {
                    type: String,
                    required: true
                },

                email: {
                    type: String,
                    required: true
                },

                joinedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },

    {
        timestamps: true
    }
);

module.exports =
    mongoose.model(
        "Project",
        projectSchema
    );