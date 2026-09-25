const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true
        },

        role: {
            type: String,
            default: "Team Member",
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Member", memberSchema);