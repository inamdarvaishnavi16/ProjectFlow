const express = require("express");
const Member = require("../models/Member");

const router = express.Router();


// CREATE a new member
router.post("/", async (req, res) => {

    try {

        const member = new Member(req.body);

        const savedMember = await member.save();

        res.status(201).json({
            success: true,
            message: "Member created successfully",
            member: savedMember
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

});


// GET all members
router.get("/", async (req, res) => {

    try {

        const members = await Member
            .find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            members
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


module.exports = router;