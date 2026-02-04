# Task Management API

A simple RESTful API for task management built using **Node.js, Express, and SQLite**.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- SQLite3
- Postman (API Documentation)

---

## 📦 Project Setup

Make sure Node.js is installed on your machine (Node.js v18+ is recommended).

````bash
npm install
````

## Compile & run the project

````bash
npm run start
````

## Authentication

Authorization: Bearer secret-token-123

## API SPEC

You can view the full API documentation via Postman:
https://documenter.getpostman.com/view/28209155/2sBXc7M4ua

Alternatively, you can use the cURL examples below.
## Login
### POST /api/login

````bash
curl -X POST http://localhost:3000/api/login \
-H "Content-Type: application/json" \
-d '{
  "email": "admin@mail.com",
  "password": "password"
}'
````

## Get Tasks (with Pagination)
### GET /tasks?page=1&limit=10

````bash
curl -X GET "http://localhost:3000/api/tasks?page=1&limit=10" \
-H "Authorization: Bearer secret-token-123"
````

## Get Task by ID
### GET /tasks/:id

````bash
curl -X GET http://localhost:3000/api/tasks/1 \
-H "Authorization: Bearer secret-token-123"
````
## Create Task
### POST /tasks

````bash
curl -X POST http://localhost:3000/api/tasks \
-H "Content-Type: application/json" \
-H "Authorization: Bearer secret-token-123" \
-d '{
  "title": "Learn Node.js",
  "description": "Build a REST API",
  "status": "pending"
}'
````

## Update Task
### PUT /tasks/:id

````bash
curl -X PUT http://localhost:3000/api/tasks/1 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer secret-token-123" \
-d '{
  "status": "done"
}'
````

## Delete Task (Soft Delete)
### DELETE /tasks/:id

````bash
curl -X DELETE http://localhost:3000/api/tasks/1 \
-H "Authorization: Bearer secret-token-123"
````
