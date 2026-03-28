# Simon Says Game - Express App

- [Live Demo ](https://simonsaysgame-y8k7.onrender.com/)
- This is a simple web application built with **Node.js**, **Express**, **MongoDB**, and **EJS**.  
  It features user signup/login with session authentication and a Simon Says style game interface.

---

## Features

- User authentication with session management
- MongoDB database for user data storage
- Protected routes for logged-in users
- No-cache middleware to prevent browser caching of protected pages
- EJS templating engine for rendering views

---

## Prerequisites

- [Node.js](https://nodejs.org/) (version 16+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas cluster
- Git (optional, to clone the repo)

---

## Setup Instructions

step.1-> Install dependencies

- Run This command = npm install

step.2->

- Create a File .env
- put this code

PORT=8080
MONGO_URL=<your-mongodb-connection-string> //your mongodb connection string.
SESSION_SECRET=<your-session-secret>
NODE_ENV=development //This Help You to Run both in localhost and production

step.3 -> Run the application
-Run this commands = npm start
