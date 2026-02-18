# DialoGO - Backend

DialoGO is a complete chat platform built with the main goal of learning and deeply understanding WebSockets in real-time applications. 

This repository contains the **backend** of the project, responsible for authentication, chat management, message handling, and real-time communication using Socket.IO.

The architecture follows a layered pattern (Controller → Service → Repository), ensuring separation of concerns, maintainability, data consistency, and security.


## 🚀 Technologies

- Node.js
- Express 5
- Socket.IO
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt
- dotenv
- pg


## 🏗 Architecture

The backend is structured using three main layers:

### Controller Layer
Responsible for:
- Handling HTTP requests and responses
- Extracting parameters
- Returning proper status codes
- Delegating business logic to services

### Service Layer
Responsible for:
- Business rules
- Validation
- Authorization checks
- Data normalization
- Coordinating repository calls

### Repository Layer
Responsible for:
- Direct interaction with PostgreSQL
- SQL queries
- Returning structured data to services

This structure guarantees:
- Better scalability
- Cleaner code
- Easier testing
- Stronger separation of responsibilities


## 🔐 Authentication

DialoGO uses JWT-based authentication.

- Passwords are hashed using bcrypt
- Login generates a signed JWT token
- Protected routes use an authentication middleware
- Socket connections are authenticated using JWT
- The authenticated user is attached to the socket instance


## 💬 Real-Time Communication

Socket.IO is used to handle:

- Authenticated socket connections
- Chat room join/leave
- Real-time message broadcasting
- Emitting new messages to specific chat rooms

Each chat works as a socket room, ensuring proper message isolation and scalability.


## 🗄 Database

The project uses PostgreSQL.

Main concepts implemented in the schema:

- Users
- Chats
- Chat membership
- Messages
- Chat ownership
- Password-protected chats

The SQL schema is available in the `db.sql` file.


## 📦 Installation

1. Clone the repository

2. Install dependencies:
```
npm install
```

3. Create a PostgreSQL database

4. Run the SQL schema inside `db.sql` to create the tables

5. Create a `.env` file with the required environment variables:
```
PORT=3000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret_key
</code>
```

6. Start the development server:
```
npm run dev
```


## 📌 Notes

- The project uses ES Modules (`"type": "module"`)
- Express 5 is used instead of Express 4
- The backend is designed to integrate with a frontend client
- All socket connections require valid JWT authentication

## 🔗 Frontend Application

The frontend application that consumes this API is available at:

https://github.com/DavidEricson00/DialoGO-Frontend
