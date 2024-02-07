# Book Store Application Backend Documentation

Welcome to the documentation for the Book Store Application Backend. This document provides an overview of the backend architecture, API endpoints, and usage instructions.


## 1. Architecture Overview 

The backend for the Book Store Application is built using Node.js and Express.js framework. It follows a RESTful architecture and is responsible for managing user authentication, book operations, purchase history, and revenue tracking for authors. The architecture consists of the following components:

- **Controllers:** Handle incoming requests, process business logic, and interact with the database.
- **Middlewares:** Implement authentication and error handling middleware.
- **Models:** Define database schemas using Sequelize ORM.
- **Routes:** Define API endpoints and route requests to the appropriate controller functions.
- **Helpers and Common:** Implement additional business logic and integrations (e.g., email notifications).

## 2. API Endpoints 

### User Endpoints

- **POST /api/user/register:** Register a new user.
- **POST /api/user/login:** Authenticate user and generate JWT token.
- **POST /api/user/forgetPassword:** Send reset password link to user's email.
- **POST /api/user/otpVerification:** Verify otp for forget password.
- **POST /api/user/resetPassword:** Reset user's password.
- **POST /api/user/logout:** Logout From a Device.
- **POST /api/user/hardlogout:** Logout From all Devices.


### Book Endpoints

- **POST /api/book/publish:** Publish a new book.
- **GET /api/book/get:** Get all book.
- **GET /api/book/get?slug=get-specific-book:** Get details of a specific book.
- **POST /api/book/purchase:** Purchase a book.

### Purchase History Endpoints

- **GET /api/book/purchase-history:** Get purchase history of a user.

## 3. Authentication 

Authentication is implemented using JSON Web Tokens (JWT). Upon successful login, a JWT token is generated and sent to the client. This token must be included in the Authorization header of subsequent requests to access protected routes.

## 4.Sell Count Logic
The logic for computing sellCount is implemented in the purchaseBook function of the Book Controller. When a user purchases a book, the sellCount of the book in the Book table is increased by the quantity of the book ordered. Simultaneously, the revenue for each author is generated, considering the price of the book ordered by the user, multiplied by the quantity of the book. The revenue per author is then updated in the Author Revenue table. Additionally, an email is sent to the author to notify them of the updated revenue.

## 4. Error Handling 

Error handling middleware is implemented to catch and format errors. Errors are returned as JSON responses with appropriate HTTP status codes and error messages.

## 5. Database Schema 

The database schema is designed using Sequelize ORM and includes tables for Users, Books, Purchase History, and Author Revenue. Refer to the database schema documentation for details on table structure and relationships.

## 6. Deployment 

The backend can be deployed to any hosting platform that supports Node.js applications. Environment variables must be configured for database connection, JWT secret, and other sensitive information.

##  Developing Environment
Node Version : v20.11.0

NPM version : 10.4.0

System : Windows 10

## Project Setup
cd root directory

npm install

npm run start

## visual representation
 +---------------+
 |   Start       |
 |               v
 +--------+--------+
     |             |
     |             |
     v             |
+---------+        |
| Clone   |        |
| Repo    |        |
+---------+        |
     |             |
     |             |
     v             |
+---------+        |
| Install |        |
| Deps    |        |
+---------+        |
     |             |
     |             |
     v             |
+----------+       |
| Configure|       |
| Db & env | <-----+
+----------+       |
     |             |
     |             |
     v             |
+---------+        |
| Run App |<-------+
+---------+        |
     |             |
     v             |
+---------+        |
| Explore |        |
| Code    |<-------+
+---------+
     |
     v
+----------------------+ | End | +----------------------+

