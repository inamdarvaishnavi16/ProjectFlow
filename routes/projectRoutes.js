const express = require("express");

const Project =
    require("../models/Project");

const Task =
    require("../models/Task");

const router =
    express.Router();


/* =========================================================
   CREATE PROJECT
   ========================================================= */

router.post(
    "/",
    async (req, res) => {

        try {

            const project =
                new Project(req.body);


            const savedProject =
                await project.save();


            res.status(201).json({

                success: true,

                message:
                    "Project created successfully",

                project:
                    savedProject

            });

        }

        catch (error) {

            res.status(400).json({

                success: false,

                message:
                    error.message

            });

        }

    }
);


/* =========================================================
   GET ALL PROJECTS
   ========================================================= */

router.get(
    "/",
    async (req, res) => {

        try {

            const projects =
                await Project
                    .find()
                    .sort({
                        createdAt: -1
                    });


            res.json({

                success: true,

                projects:
                    projects

            });

        }

        catch (error) {

            res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    }
);


/* =========================================================
   ENABLE / UPDATE COLLABORATION
   ========================================================= */

router.put(
    "/:id/collaboration",
    async (req, res) => {

        try {

            const {
                collaborationEnabled,
                skillsNeeded
            } = req.body;


            const project =
                await Project.findById(
                    req.params.id
                );


            if (!project) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Project not found"

                });

            }


            project.collaborationEnabled =
                collaborationEnabled;


            project.skillsNeeded =
                skillsNeeded || "";


            const updatedProject =
                await project.save();


            res.json({

                success: true,

                message:
                    "Collaboration settings updated",

                project:
                    updatedProject

            });

        }

        catch (error) {

            console.error(
                "Error updating collaboration:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    }
);


/* =========================================================
   SHOW INTEREST IN PROJECT
   ========================================================= */

router.post(
    "/:id/interested",
    async (req, res) => {

        try {

            const {
                name,
                email
            } = req.body;


            if (
                !name ||
                !email
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Name and email are required"

                });

            }


            const project =
                await Project.findById(
                    req.params.id
                );


            if (!project) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Project not found"

                });

            }


            if (
                !project.collaborationEnabled
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Collaboration is not enabled for this project"

                });

            }


            const alreadyInterested =
                project.interestedUsers.some(
                    user =>
                        user.email
                            .toLowerCase() ===
                        email
                            .trim()
                            .toLowerCase()
                );


            if (alreadyInterested) {

                return res.status(400).json({

                    success: false,

                    message:
                        "You have already shown interest in this project"

                });

            }


            project.interestedUsers.push({

                name:
                    name.trim(),

                email:
                    email.trim()

            });


            await project.save();


            res.json({

                success: true,

                message:
                    "Interest submitted successfully",

                project:
                    project

            });

        }

        catch (error) {

            console.error(
                "Error submitting interest:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    }
);


/* =========================================================
   DELETE PROJECT
   ========================================================= */

router.delete(
    "/:id",
    async (req, res) => {

        try {

            const projectId =
                req.params.id;


            const project =
                await Project.findById(
                    projectId
                );


            if (!project) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Project not found"

                });

            }


            await Task.deleteMany({
                projectId:
                    projectId
            });


            await Project.findByIdAndDelete(
                projectId
            );


            res.json({

                success: true,

                message:
                    "Project and related tasks deleted successfully"

            });

        }

        catch (error) {

            console.error(
                "Error deleting project:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    }
);


module.exports = router;