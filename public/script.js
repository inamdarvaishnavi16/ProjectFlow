/* =========================================================
   PROJECTFLOW
   FRONTEND JAVASCRIPT
   ========================================================= */


/* =========================================================
   GLOBAL DATA
   ========================================================= */

let projects = [];
let members = [];
let tasks = [];

let activities =
    JSON.parse(
        localStorage.getItem(
            "projectFlowActivities"
        )
    ) || [];


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const projectModal =
    document.getElementById("projectModal");

const memberModal =
    document.getElementById("memberModal");

const taskModal =
    document.getElementById("taskModal");

const projectForm =
    document.getElementById("projectForm");

const memberForm =
    document.getElementById("memberForm");

const taskForm =
    document.getElementById("taskForm");


/* =========================================================
   COLLABORATION DOM ELEMENTS
   ========================================================= */

const projectCollaboration =
    document.getElementById(
        "projectCollaboration"
    );

const skillsNeededGroup =
    document.getElementById(
        "skillsNeededGroup"
    );

const projectSkillsNeeded =
    document.getElementById(
        "projectSkillsNeeded"
    );


/* =========================================================
   UTILITY FUNCTIONS
   ========================================================= */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/*
   Format YYYY-MM-DD safely.
   This avoids timezone-related one-day shifts.
*/
function formatDate(dateValue) {

    if (!dateValue) {
        return "Not set";
    }

    const value =
        String(dateValue).substring(0, 10);

    const parts =
        value.split("-");

    if (parts.length !== 3) {
        return "Not set";
    }

    const date =
        new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );

    if (Number.isNaN(date.getTime())) {
        return "Not set";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


function getInitials(name) {

    if (!name) {
        return "?";
    }

    const parts =
        name.trim().split(/\s+/);

    if (parts.length === 1) {

        return parts[0]
            .substring(0, 2)
            .toUpperCase();

    }

    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();
}


/* =========================================================
   DATE / OVERDUE HELPERS
   ========================================================= */

function isOverdue(task) {

    if (!task.deadline) {
        return false;
    }

    if (task.status === "Completed") {
        return false;
    }

    const value =
        String(task.deadline)
            .substring(0, 10);

    const parts =
        value.split("-");

    const deadline =
        new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    deadline.setHours(
        0,
        0,
        0,
        0
    );

    return deadline < today;
}


/*
   Check whether a project deadline
   has passed.
*/
function isProjectOverdue(project) {

    if (!project.deadline) {
        return false;
    }

    const value =
        String(project.deadline)
            .substring(0, 10);

    const parts =
        value.split("-");

    const deadline =
        new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    deadline.setHours(
        0,
        0,
        0,
        0
    );

    return deadline < today;
}


/* =========================================================
   STATUS HELPERS
   ========================================================= */

function getStatusClass(status) {

    if (status === "Completed") {
        return "status-completed";
    }

    if (status === "In Progress") {
        return "status-progress";
    }

    if (status === "Overdue") {
        return "status-overdue";
    }

    return "status-todo";
}


function statusBadge(status) {

    return `
        <span class="status-badge ${getStatusClass(status)}">
            ${escapeHtml(status)}
        </span>
    `;
}


/*
   Project status is calculated from tasks.

   0 tasks
      ↓
   Not Started

   Tasks exist but none completed /
   in progress
      ↓
   Not Started

   Some work started
      ↓
   In Progress

   All tasks completed
      ↓
   Completed

   Deadline passed and not completed
      ↓
   Overdue
*/
function getProjectStatus(project) {

    const projectTasks =
        getProjectTasks(project._id);

    if (projectTasks.length === 0) {
        return "Not Started";
    }


    const completed =
        projectTasks.filter(
            task =>
                task.status ===
                "Completed"
        ).length;


    if (
        completed ===
        projectTasks.length
    ) {
        return "Completed";
    }


    if (
        isProjectOverdue(project)
    ) {
        return "Overdue";
    }


    const started =
        projectTasks.some(
            task =>
                task.status ===
                    "In Progress" ||
                task.status ===
                    "Completed"
        );


    if (started) {
        return "In Progress";
    }


    return "Not Started";
}


/* =========================================================
   ACTIVITY
   ========================================================= */

function addActivity(message) {

    const activity = {

        message: message,

        time:
            new Date().toLocaleString(
                "en-IN"
            )

    };

    activities.unshift(activity);

    activities =
        activities.slice(0, 30);

    localStorage.setItem(
        "projectFlowActivities",
        JSON.stringify(activities)
    );

    renderActivities();
}


function renderActivities() {

    const containers = [

        document.getElementById(
            "activityContainer"
        ),

        document.getElementById(
            "activityPageContainer"
        )

    ];


    containers.forEach(
        container => {

            if (!container) {
                return;
            }


            if (activities.length === 0) {

                container.innerHTML = `
                    <p class="no-activity">
                        No activity yet.
                    </p>
                `;

                return;
            }


            container.innerHTML = "";


            activities
                .slice(0, 15)
                .forEach(activity => {

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.className =
                        "activity-item";


                    const message =
                        document.createElement(
                            "strong"
                        );

                    message.textContent =
                        activity.message;


                    const time =
                        document.createElement(
                            "small"
                        );

                    time.textContent =
                        activity.time;


                    item.appendChild(message);

                    item.appendChild(time);

                    container.appendChild(item);

                });

        }
    );
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function showSection(sectionId) {

    document
        .querySelectorAll(".page-section")
        .forEach(section => {

            section.classList.remove(
                "active-section"
            );

        });


    const target =
        document.getElementById(
            sectionId
        );


    if (target) {

        target.classList.add(
            "active-section"
        );

    }


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove(
                "active"
            );


            if (
                item.dataset.section ===
                sectionId
            ) {

                item.classList.add(
                    "active"
                );

            }

        });


    if (sectionId === "projects") {
        renderProjectsPage();
    }


    if (sectionId === "tasks") {

        renderTasksTable(
            document.getElementById(
                "taskFilter"
            )?.value || "all"
        );

    }


    if (sectionId === "activity") {
        renderActivities();
    }


    if (sectionId === "team") {
        renderMembers();
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


document
    .querySelectorAll(".nav-item")
    .forEach(item => {

        item.addEventListener(
            "click",
            event => {

                event.preventDefault();

                showSection(
                    item.dataset.section
                );

            }
        );

    });


/* =========================================================
   MODALS
   ========================================================= */

function openProjectModal() {

    projectModal.style.display = "flex";

}


function closeProjectModal() {

    projectModal.style.display = "none";

}


function openMemberModal() {

    memberModal.style.display = "flex";

}


function closeMemberModalWindow() {

    memberModal.style.display = "none";

}


async function openTaskModal() {

    await loadProjects();

    await loadMembers();

    populateTaskDropdowns();

    taskModal.style.display = "flex";

}


function closeTaskModalWindow() {

    taskModal.style.display = "none";

}


/* =========================================================
   COLLABORATION FORM VISIBILITY
   ========================================================= */

/*
   Shows the Skills / Role Needed field
   only when collaboration is enabled.
*/

function updateCollaborationField() {

    if (
        !projectCollaboration ||
        !skillsNeededGroup
    ) {
        return;
    }


    if (projectCollaboration.checked) {

        skillsNeededGroup.style.display =
            "block";

    } else {

        skillsNeededGroup.style.display =
            "none";

        if (projectSkillsNeeded) {

            projectSkillsNeeded.value =
                "";

        }

    }

}


/*
   Listen for checkbox changes.
*/

if (projectCollaboration) {

    projectCollaboration.addEventListener(
        "change",
        updateCollaborationField
    );

}


/* =========================================================
   RESET COLLABORATION FORM
   ========================================================= */

function resetCollaborationFields() {

    if (projectCollaboration) {

        projectCollaboration.checked =
            false;

    }


    if (projectSkillsNeeded) {

        projectSkillsNeeded.value =
            "";

    }


    if (skillsNeededGroup) {

        skillsNeededGroup.style.display =
            "none";

    }

}


/* =========================================================
   MODAL BUTTONS
   ========================================================= */

document
    .getElementById("newProjectBtn")
    .addEventListener(
        "click",
        openProjectModal
    );


document
    .getElementById("dashboardNewProject")
    .addEventListener(
        "click",
        openProjectModal
    );


document
    .getElementById("projectsNewProjectBtn")
    .addEventListener(
        "click",
        openProjectModal
    );


document
    .getElementById("addMemberBtn")
    .addEventListener(
        "click",
        openMemberModal
    );


document
    .getElementById("teamAddMemberBtn")
    .addEventListener(
        "click",
        openMemberModal
    );


document
    .getElementById("addTaskBtn")
    .addEventListener(
        "click",
        openTaskModal
    );


document
    .getElementById("dashboardAddTaskBtn")
    .addEventListener(
        "click",
        openTaskModal
    );


document
    .getElementById("closeModal")
    .addEventListener(
        "click",
        closeProjectModal
    );


document
    .getElementById("cancelProjectBtn")
    .addEventListener(
        "click",
        closeProjectModal
    );


document
    .getElementById("closeMemberModal")
    .addEventListener(
        "click",
        closeMemberModalWindow
    );


document
    .getElementById("cancelMemberBtn")
    .addEventListener(
        "click",
        closeMemberModalWindow
    );


document
    .getElementById("closeTaskModal")
    .addEventListener(
        "click",
        closeTaskModalWindow
    );


document
    .getElementById("cancelTaskBtn")
    .addEventListener(
        "click",
        closeTaskModalWindow
    );


window.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            projectModal
        ) {

            closeProjectModal();

        }


        if (
            event.target ===
            memberModal
        ) {

            closeMemberModalWindow();

        }


        if (
            event.target ===
            taskModal
        ) {

            closeTaskModalWindow();

        }

    }
);


/* =========================================================
   CREATE PROJECT
   ========================================================= */

projectForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const projectData = {

            name:
                document
                    .getElementById(
                        "projectName"
                    )
                    .value
                    .trim(),

            description:
                document
                    .getElementById(
                        "projectDescription"
                    )
                    .value
                    .trim(),

            technology:
                document
                    .getElementById(
                        "projectTechnology"
                    )
                    .value
                    .trim(),

            startDate:
                document
                    .getElementById(
                        "projectStartDate"
                    )
                    .value,

            deadline:
                document
                    .getElementById(
                        "projectDeadline"
                    )
                    .value,

            /* =========================================
               COLLABORATION DATA
               ========================================= */

            collaborationEnabled:
                projectCollaboration
                    ? projectCollaboration.checked
                    : false,

            skillsNeeded:
                projectSkillsNeeded
                    ? projectSkillsNeeded.value.trim()
                    : ""

        };


        if (
            projectData.startDate &&
            projectData.deadline &&
            projectData.deadline <
            projectData.startDate
        ) {

            alert(
                "Deadline cannot be before the start date."
            );

            return;

        }


        try {

            const response =
                await fetch(
                    "/api/projects",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                projectData
                            )

                    }
                );


            const data =
                await response.json();


            if (!data.success) {

                alert(
                    "Failed to create project: " +
                    data.message
                );

                return;

            }


            alert(
                "Project created successfully!"
            );


            addActivity(
                `Project "${projectData.name}" was created`
            );


            projectForm.reset();

            resetCollaborationFields();

            closeProjectModal();


            await loadProjects();

            await loadTasks();

        }

        catch (error) {

            console.error(
                "Error creating project:",
                error
            );

            alert(
                "Something went wrong while creating the project."
            );

        }

    }
);


/* =========================================================
   LOAD PROJECTS
   ========================================================= */

async function loadProjects() {

    try {

        const response =
            await fetch(
                "/api/projects"
            );


        const data =
            await response.json();


        if (!data.success) {

            console.error(
                data.message
            );

            return;

        }


        projects =
            data.projects || [];


        const totalProjects =
            document.getElementById(
                "totalProjects"
            );


        if (totalProjects) {

            totalProjects.textContent =
                projects.length;

        }


        renderProjects();

        renderProjectsPage();

        populateProjectDropdown();

    }

    catch (error) {

        console.error(
            "Error loading projects:",
            error
        );

    }
}


/* =========================================================
   PROJECT TASKS
   ========================================================= */

function getProjectTasks(projectId) {

    return tasks.filter(task => {

        if (!task.projectId) {
            return false;
        }


        const id =
            typeof task.projectId ===
            "object"
                ? task.projectId._id
                : task.projectId;


        return id === projectId;

    });

}


/* =========================================================
   PROJECT PROGRESS
   ========================================================= */

function getProjectProgress(projectId) {

    const projectTasks =
        getProjectTasks(projectId);


    if (projectTasks.length === 0) {
        return 0;
    }


    const completed =
        projectTasks.filter(
            task =>
                task.status ===
                "Completed"
        ).length;


    return Math.round(
        (
            completed /
            projectTasks.length
        ) * 100
    );

}


/* =========================================================
   PROJECT CARD
   ========================================================= */

function renderProjectCard(project) {

    const projectTasks =
        getProjectTasks(
            project._id
        );


    const completed =
        projectTasks.filter(
            task =>
                task.status ===
                "Completed"
        ).length;


    const progress =
        projectTasks.length === 0
            ? 0
            : Math.round(
                (
                    completed /
                    projectTasks.length
                ) * 100
            );


    const projectStatus =
        getProjectStatus(project);


    const projectMembers =
        new Set(
            projectTasks
                .filter(
                    task =>
                        task.assignedTo
                )
                .map(task => {

                    return typeof task.assignedTo ===
                        "object"
                        ? task.assignedTo._id
                        : task.assignedTo;

                })
        );


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "project-card";


    card.innerHTML = `

        <div class="project-card-top">

            <div class="project-title-area">

                <h3>
                    ${escapeHtml(project.name)}
                </h3>

            </div>

            <div class="project-status-area">

                ${statusBadge(projectStatus)}

            </div>

        </div>


        <p class="project-description">

            ${escapeHtml(
                project.description ||
                "No project description provided."
            )}

        </p>


        <span class="project-tech">

            ${escapeHtml(
                project.technology ||
                "Technology not specified"
            )}

        </span>


        <div class="project-details">

            <div class="project-detail">

                <span>
                    Start Date
                </span>

                <strong>
                    ${formatDate(
                        project.startDate
                    )}
                </strong>

            </div>


            <div class="project-detail">

                <span>
                    Deadline
                </span>

                <strong>
                    ${formatDate(
                        project.deadline
                    )}
                </strong>

            </div>

        </div>


        <div class="project-progress-label">

            <span>
                Project Progress
            </span>

            <strong>
                ${progress}%
            </strong>

        </div>


        <div class="project-mini-progress">

            <div
                class="project-mini-fill"
                style="width: ${progress}%"
            ></div>

        </div>


        <div class="project-footer">

            <div class="project-meta">

                <span>
                    Tasks
                </span>

                <strong>
                    ${completed}/${projectTasks.length}
                </strong>

            </div>


            <div class="project-meta">

                <span>
                    Members
                </span>

                <strong>
                    ${projectMembers.size}
                </strong>

            </div>


            <div class="project-meta">

                <span>
                    Deadline
                </span>

                <strong>
                    ${formatDate(
                        project.deadline
                    )}
                </strong>

            </div>

        </div>


        ${getCollaborationHtml(project)}


        <div class="project-card-actions">

            <button
                type="button"
                class="delete-project-btn"
            >
                Delete Project
            </button>

        </div>

    `;


    const deleteButton =
        card.querySelector(
            ".delete-project-btn"
        );


    deleteButton.addEventListener(
        "click",
        () => {

            deleteProject(
                project._id,
                project.name
            );

        }
    );


    return card;

}


/* =========================================================
   RENDER DASHBOARD PROJECTS
   ========================================================= */

function renderProjects() {

    const container =
        document.getElementById(
            "projectsContainer"
        );


    if (!container) {
        return;
    }


    if (projects.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    No projects yet
                </h3>

                <p>
                    Create your first project to get started.
                </p>

                <button
                    class="primary-btn"
                    id="createFirstProject"
                >
                    Create Project
                </button>

            </div>

        `;


        const button =
            document.getElementById(
                "createFirstProject"
            );


        if (button) {

            button.addEventListener(
                "click",
                openProjectModal
            );

        }


        return;

    }


    container.innerHTML = "";


    projects
        .forEach(project => {

            container.appendChild(
                renderProjectCard(project)
            );

        });

}


/* =========================================================
   RENDER PROJECTS PAGE
   ========================================================= */

function renderProjectsPage() {

    const container =
        document.getElementById(
            "projectsPageContainer"
        );


    if (!container) {
        return;
    }


    if (projects.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    No projects yet
                </h3>

                <p>
                    Create your first project.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    projects.forEach(project => {

        container.appendChild(
            renderProjectCard(project)
        );

    });

}


/* =========================================================
   DELETE PROJECT
   ========================================================= */

async function deleteProject(
    projectId,
    projectName
) {

    const confirmed =
        confirm(
            `Are you sure you want to delete "${projectName}"?\n\nThis will also delete all tasks belonging to this project.`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/projects/${projectId}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!data.success) {

            alert(
                "Failed to delete project: " +
                data.message
            );

            return;

        }


        addActivity(
            `Project "${projectName}" was deleted`
        );


        alert(
            "Project deleted successfully!"
        );


        await loadProjects();

        await loadTasks();

    }

    catch (error) {

        console.error(
            "Error deleting project:",
            error
        );


        alert(
            "Something went wrong while deleting the project."
        );

    }

}


/* =========================================================
   PROJECT DROPDOWN
   ========================================================= */

function populateProjectDropdown() {

    const dropdown =
        document.getElementById(
            "taskProject"
        );


    if (!dropdown) {
        return;
    }


    dropdown.innerHTML = `

        <option value="">
            Select Project
        </option>

    `;


    projects.forEach(project => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            project._id;


        option.textContent =
            project.name;


        dropdown.appendChild(
            option
        );

    });

}


/* =========================================================
   CREATE MEMBER
   ========================================================= */

memberForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const memberData = {

            name:
                document
                    .getElementById(
                        "memberName"
                    )
                    .value
                    .trim(),

            email:
                document
                    .getElementById(
                        "memberEmail"
                    )
                    .value
                    .trim(),

            role:
                document
                    .getElementById(
                        "memberRole"
                    )
                    .value
                    .trim()

        };


        try {

            const response =
                await fetch(
                    "/api/members",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                memberData
                            )

                    }
                );


            const data =
                await response.json();


            if (!data.success) {

                alert(
                    "Failed to add member: " +
                    data.message
                );

                return;

            }


            alert(
                "Member added successfully!"
            );


            addActivity(
                `Member "${memberData.name}" was added`
            );


            memberForm.reset();

            closeMemberModalWindow();


            await loadMembers();

        }

        catch (error) {

            console.error(
                "Error creating member:",
                error
            );


            alert(
                "Something went wrong while adding the member."
            );

        }

    }
);


/* =========================================================
   LOAD MEMBERS
   ========================================================= */

async function loadMembers() {

    try {

        const response =
            await fetch(
                "/api/members"
            );


        const data =
            await response.json();


        if (!data.success) {

            console.error(
                data.message
            );

            return;

        }


        members =
            data.members || [];


        renderMembers();

        populateMemberDropdown();

    }

    catch (error) {

        console.error(
            "Error loading members:",
            error
        );

    }

}


/* =========================================================
   RENDER MEMBERS
   ========================================================= */

function renderMembers() {

    const container =
        document.getElementById(
            "membersContainer"
        );


    if (!container) {
        return;
    }


    if (members.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    No team members yet
                </h3>

                <p>
                    Add members to your project team.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        members
            .map(member => {

                return `

                    <div class="member-card">

                        <div class="member-top">

                            <div class="member-avatar">

                                ${getInitials(
                                    member.name
                                )}

                            </div>


                            <div>

                                <div class="member-name">

                                    ${escapeHtml(
                                        member.name
                                    )}

                                </div>


                                <div class="member-role">

                                    ${escapeHtml(
                                        member.role ||
                                        "Team Member"
                                    )}

                                </div>

                            </div>

                        </div>


                        <div class="member-email">

                            ${escapeHtml(
                                member.email
                            )}

                        </div>

                    </div>

                `;

            })
            .join("");

}


/* =========================================================
   MEMBER DROPDOWN
   ========================================================= */

function populateMemberDropdown() {

    const dropdown =
        document.getElementById(
            "taskAssignedTo"
        );


    if (!dropdown) {
        return;
    }


    dropdown.innerHTML = `

        <option value="">
            Unassigned
        </option>

    `;


    members.forEach(member => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            member._id;


        option.textContent =
            `${member.name} — ${member.role || "Team Member"}`;


        dropdown.appendChild(
            option
        );

    });

}


function populateTaskDropdowns() {

    populateProjectDropdown();

    populateMemberDropdown();

}


/* =========================================================
   CREATE TASK
   ========================================================= */

taskForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const taskData = {

            title:
                document
                    .getElementById(
                        "taskTitle"
                    )
                    .value
                    .trim(),

            description:
                document
                    .getElementById(
                        "taskDescription"
                    )
                    .value
                    .trim(),

            projectId:
                document
                    .getElementById(
                        "taskProject"
                    )
                    .value || null,

            assignedTo:
                document
                    .getElementById(
                        "taskAssignedTo"
                    )
                    .value || null,

            deadline:
                document
                    .getElementById(
                        "taskDeadline"
                    )
                    .value,

            status:
                document
                    .getElementById(
                        "taskStatus"
                    )
                    .value

        };


        if (!taskData.projectId) {

            alert(
                "Please select a project."
            );

            return;

        }


        try {

            const response =
                await fetch(
                    "/api/tasks",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                taskData
                            )

                    }
                );


            const data =
                await response.json();


            if (!data.success) {

                alert(
                    "Failed to create task: " +
                    data.message
                );

                return;

            }


            alert(
                "Task created successfully!"
            );


            addActivity(
                `Task "${taskData.title}" was created`
            );


            taskForm.reset();

            closeTaskModalWindow();


            await loadTasks();

            await loadProjects();

        }

        catch (error) {

            console.error(
                "Error creating task:",
                error
            );


            alert(
                "Something went wrong while creating the task."
            );

        }

    }
);


/* =========================================================
   LOAD TASKS
   ========================================================= */

async function loadTasks() {

    try {

        const response =
            await fetch(
                "/api/tasks"
            );


        const data =
            await response.json();


        if (!data.success) {

            console.error(
                data.message
            );

            return;

        }


        tasks =
            data.tasks || [];


        updateTaskStatistics();


        renderTasksTable(
            document.getElementById(
                "taskFilter"
            )?.value || "all"
        );


        renderDashboardTasks();

        renderProjects();

        renderProjectsPage();

    }

    catch (error) {

        console.error(
            "Error loading tasks:",
            error
        );

    }

}


/* =========================================================
   TASK STATISTICS
   ========================================================= */

function updateTaskStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task =>
                task.status ===
                "Completed"
        ).length;


    const overdue =
        tasks.filter(
            isOverdue
        ).length;


    const totalElement =
        document.getElementById(
            "totalTasks"
        );


    const completedElement =
        document.getElementById(
            "completedTasks"
        );


    const overdueElement =
        document.getElementById(
            "overdueTasks"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (completedElement) {

        completedElement.textContent =
            completed;

    }


    if (overdueElement) {

        overdueElement.textContent =
            overdue;

    }


    /*
       Overall Progress =
       completed tasks /
       total tasks
    */

    const progress =
        total === 0
            ? 0
            : Math.round(
                (
                    completed /
                    total
                ) * 100
            );


    const progressText =
        document.getElementById(
            "progressText"
        );


    const progressFill =
        document.getElementById(
            "progressFill"
        );


    if (progressText) {

        progressText.textContent =
            `${progress}%`;

    }


    if (progressFill) {

        progressFill.style.width =
            `${progress}%`;

    }

}


/* =========================================================
   GET PROJECT NAME
   ========================================================= */

function getProjectName(task) {

    if (!task.projectId) {
        return "No Project";
    }


    if (
        typeof task.projectId ===
        "object"
    ) {

        return (
            task.projectId.name ||
            "No Project"
        );

    }


    const project =
        projects.find(
            item =>
                item._id ===
                task.projectId
        );


    return project
        ? project.name
        : "No Project";

}


/* =========================================================
   GET MEMBER
   ========================================================= */

function getTaskMember(task) {

    if (!task.assignedTo) {
        return null;
    }


    if (
        typeof task.assignedTo ===
        "object"
    ) {

        return task.assignedTo;

    }


    return members.find(
        member =>
            member._id ===
            task.assignedTo
    ) || null;

}


/* =========================================================
   TASK TABLE ROW
   ========================================================= */

function renderTaskRow(task) {

    const member =
        getTaskMember(task);


    const overdue =
        isOverdue(task);


    const deadlineClass =
        overdue
            ? "deadline-overdue"
            : "deadline-normal";


    const status =
        overdue
            ? `
                <span class="status-badge status-overdue">
                    Overdue
                </span>
            `
            : statusBadge(
                task.status
            );


    const memberHtml =
        member
            ? `

                <div class="assignee">

                    <div class="avatar">

                        ${getInitials(
                            member.name
                        )}

                    </div>

                    <span class="assignee-name">

                        ${escapeHtml(
                            member.name
                        )}

                    </span>

                </div>

            `
            : `

                <span class="assignee-name">
                    Unassigned
                </span>

            `;


    return `

        <tr>

            <td>

                <span class="task-name">

                    ${escapeHtml(
                        task.title
                    )}

                </span>

            </td>


            <td>

                <span class="task-project">

                    ${escapeHtml(
                        getProjectName(task)
                    )}

                </span>

            </td>


            <td>

                ${memberHtml}

            </td>


            <td>

                <span class="${deadlineClass}">

                    ${formatDate(
                        task.deadline
                    )}

                </span>

            </td>


            <td>

                ${status}

            </td>

        </tr>

    `;

}


/* =========================================================
   TASK TABLE
   ========================================================= */

function renderTasksTable(
    filter = "all"
) {

    const body =
        document.getElementById(
            "tasksTableBody"
        );


    if (!body) {
        return;
    }


    let filteredTasks =
        [...tasks];


    if (filter !== "all") {

        filteredTasks =
            filteredTasks.filter(
                task =>
                    task.status ===
                    filter
            );

    }


    if (filteredTasks.length === 0) {

        body.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="table-empty"
                >

                    No tasks found.

                </td>

            </tr>

        `;

        return;

    }


    body.innerHTML =
        filteredTasks
            .map(renderTaskRow)
            .join("");

}


/* =========================================================
   DASHBOARD TASKS
   ========================================================= */

function renderDashboardTasks() {

    const body =
        document.getElementById(
            "dashboardTasksTable"
        );


    if (!body) {
        return;
    }


    if (tasks.length === 0) {

        body.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="table-empty"
                >

                    No tasks created yet.

                </td>

            </tr>

        `;

        return;

    }


    body.innerHTML =
        tasks
            .slice(0, 6)
            .map(renderTaskRow)
            .join("");

}


/* =========================================================
   TASK FILTER
   ========================================================= */

const taskFilter =
    document.getElementById(
        "taskFilter"
    );


if (taskFilter) {

    taskFilter.addEventListener(
        "change",
        () => {

            renderTasksTable(
                taskFilter.value
            );

        }
    );

}


/* =========================================================
   VIEW PROJECTS
   ========================================================= */

document
    .getElementById(
        "viewProjectsBtn"
    )
    .addEventListener(
        "click",
        () => {

            showSection(
                "projects"
            );

        }
    );


/* =========================================================
   GREETING
   ========================================================= */

function updateGreeting() {

    const heading =
        document.querySelector(
            "#dashboard .page-heading h2"
        );


    if (!heading) {
        return;
    }


    const hour =
        new Date().getHours();


    let greeting;


    if (hour < 12) {

        greeting =
            "Good morning 👋";

    } else if (hour < 17) {

        greeting =
            "Good afternoon 👋";

    } else {

        greeting =
            "Good evening 👋";

    }


    heading.textContent =
        greeting;

}


/* =========================================================
   COLLABORATION FEATURE
   ========================================================= */


/* =========================================================
   PROJECT COLLABORATION DISPLAY
   ========================================================= */

/*
   This function creates the collaboration section
   shown inside each project card.
*/

function getCollaborationHtml(project) {

    if (
        project.collaborationEnabled
    ) {

        return `

            <div class="collaboration-box">

                <div class="collaboration-header">

                    <span>
                        🤝 Open for Collaboration
                    </span>

                </div>


                <p class="skills-needed">

                    <strong>
                        Skills / Role Needed:
                    </strong>

                    ${escapeHtml(
                        project.skillsNeeded ||
                        "General team member"
                    )}

                </p>


                <div class="interest-count">

                    👥 ${
                        project.interestedUsers
                            ? project.interestedUsers.length
                            : 0
                    }

                    interested

                </div>


                <button
                    type="button"
                    class="interested-btn"
                    data-project-id="${project._id}"
                >

                    I'm Interested

                </button>

            </div>

        `;

    }


    return `

        <div class="collaboration-closed">

            🔒 Collaboration not enabled

        </div>

    `;

}


/* =========================================================
   I'M INTERESTED BUTTON
   ========================================================= */

document.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                ".interested-btn"
            );


        if (!button) {
            return;
        }


        const projectId =
            button.dataset.projectId;


        const name =
            prompt(
                "Enter your name:"
            );


        if (
            !name ||
            !name.trim()
        ) {

            return;

        }


        const email =
            prompt(
                "Enter your email:"
            );


        if (
            !email ||
            !email.trim()
        ) {

            return;

        }


        try {

            button.disabled =
                true;


            button.textContent =
                "Submitting...";


            const response =
                await fetch(
                    `/api/projects/${projectId}/interested`,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                name:
                                    name.trim(),

                                email:
                                    email.trim()

                            })

                    }
                );


            const data =
                await response.json();


            if (!data.success) {

                alert(
                    data.message
                );


                button.disabled =
                    false;


                button.textContent =
                    "I'm Interested";


                return;

            }


            alert(
                "Your interest has been submitted!"
            );


            addActivity(
                `You showed interest in project "${data.project.name}"`
            );


            await loadProjects();

            await loadTasks();

        }


        catch (error) {

            console.error(
                "Collaboration error:",
                error
            );


            alert(
                "Something went wrong. Please try again."
            );


            button.disabled =
                false;


            button.textContent =
                "I'm Interested";

        }

    }
);


/* =========================================================
   INITIAL LOAD
   ========================================================= */

async function initializeApp() {

    updateGreeting();

    renderActivities();


    await loadProjects();

    await loadMembers();

    await loadTasks();


    populateTaskDropdowns();


    /*
       Make sure collaboration fields
       start in the correct state.
    */

    resetCollaborationFields();


    /*
       Open dashboard by default.
    */

    showSection("dashboard");

}

async function loadCommitId() {
    try {
        const response = await fetch("/api/commit");
        const data = await response.json();

        const commitElement = document.getElementById("commitId");

        if (commitElement) {
            commitElement.textContent = data.commit;
        }
    } catch (error) {
        console.error("Failed to load commit ID:", error);
    }
}

loadCommitId();


/* =========================================================
   START APPLICATION
   ========================================================= */

initializeApp();