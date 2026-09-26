# ProjectFlow

ProjectFlow is a web-based project management application built using Node.js, Express.js, MongoDB, HTML, CSS and JavaScript.

It helps users manage projects, team members and tasks through a simple web interface and REST APIs.

## Features

- Create and manage projects
- Add project description, technology, start date and deadline
- Validate project information before saving
- View project information
- Manage team members
- Manage tasks
- REST API endpoints
- Health check endpoint
- Docker containerization
- Automated testing with Jest and Supertest
- ESLint code quality checking
- GitHub Actions CI/CD pipeline
- Automatic deployment to Render
- Running Git commit ID displayed on the live application

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- HTML
- CSS
- JavaScript
- Jest
- Supertest
- ESLint
- Docker
- GitHub Actions
- Render

## Project Structure

```text
ProjectFlow/
│
├── models/
│   ├── Project.js
│   ├── Member.js
│   └── Task.js
│
├── routes/
│   ├── projectRoutes.js
│   ├── memberRoutes.js
│   └── taskRoutes.js
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── tests/
│   └── server.test.js
│
├── server.js
├── package.json
├── package-lock.json
├── Dockerfile
├── .dockerignore
├── eslint.config.mjs
└── README.md
