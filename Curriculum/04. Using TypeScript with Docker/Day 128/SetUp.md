### Set up development environment
To set up a complete development environment for a full-stack application using TypeScript, Express, PostgreSQL, and TypeORM entirely within Docker, we will create a Dockerfile for the Node.js application and use Docker Compose to manage the services. Below is a step-by-step guide to achieve this.

### Complete Development Setup in Docker

#### 1. Project Structure

Create the following folder structure for your project:

```

my-fullstack-project/

│
├── src/
│ ├── entities/
│ │ └── User.ts
│ ├── index.ts
│ └── ormconfig.ts
├── .env
├── docker-compose.yml
├── Dockerfile
└── package.json
```
#### 2. Create `package.json`
Run the following command to create a `package.json` file:
```bash
npm init -y
```
Then, install the necessary dependencies:
```bash
npm install express typescript ts-node typeorm reflect-metadata pg dotenv
```
### Explanation of each dependency
### 1. **express**
- **Description**: Express is a minimal and flexible Node.js web application framework that provides a robust set of features for building web and mobile applications. It simplifies the process of creating server-side applications and APIs.
- **Key Features**:
- Middleware support for handling requests and responses.
- Routing capabilities to define URL endpoints.
- Support for various templating engines.
- Easy integration with databases and other services.
### 2. **typescript**
- **Description**: TypeScript is a superset of JavaScript that adds static typing to the language. It helps developers catch errors at compile time rather than runtime, making code more robust and maintainable.
- **Key Features**:
- Type annotations for variables, function parameters, and return types.
- Interfaces and enums for better structure and organization.
- Advanced features like generics and decorators.
- Compatibility with existing JavaScript code.
### 3. **ts-node**
- **Description**: `ts-node` is a TypeScript execution engine for Node.js that allows you to run TypeScript files directly without pre-compiling them to JavaScript. It is particularly useful for development and testing.
- **Key Features**:
- On-the-fly compilation of TypeScript code.
- Easy integration with Node.js applications.
- Supports TypeScript configuration files (`tsconfig.json`).
### 4. **typeorm**
- **Description**: TypeORM is an Object-Relational Mapper (ORM) for TypeScript and JavaScript that allows developers to interact with databases using TypeScript classes and objects instead of raw SQL queries. It supports various database systems, including PostgreSQL, MySQL, SQLite, and more.
- **Key Features**:
- Entity-based data modeling using classes.
- Support for migrations, which help manage database schema changes.
- Query builder for constructing complex queries.
- Eager and lazy loading of related entities.
### 5. **reflect-metadata**
- **Description**: `reflect-metadata` is a library that provides a way to add metadata to JavaScript objects. It is often used in conjunction with TypeScript decorators, which are a key feature of TypeORM and other libraries.
- **Key Features**:
- Enables the use of decorators to add metadata to classes and properties.
- Required for TypeORM to function correctly, as it relies on metadata to map entities to database tables.
### 6. **pg**
- **Description**: `pg` is a PostgreSQL client for Node.js. It allows Node.js applications to connect to and interact with PostgreSQL databases. It provides a simple API for executing SQL queries and managing database connections.
- **Key Features**:
- Support for connection pooling to manage multiple database connections efficiently.
- Ability to execute raw SQL queries and parameterized queries.
- Support for transactions and prepared statements.
### 7. **dotenv**
- **Description**: `dotenv` is a zero-dependency module that loads environment variables from a `.env` file into `process.env`. This is useful for managing configuration settings, such as database connection strings and API keys, without hardcoding them in your application code.
- **Key Features**:
- Simplifies the management of environment-specific configurations.
- Keeps sensitive information out of source code.
- Easy to use with a simple syntax for defining variables in a `.env` file.
#### 3. Create `Dockerfile`
Create a `Dockerfile` in the root of your project:
```dockerfile
# Use the official Node.js image as a base
FROM node:14
# Set the working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application code
COPY . .
# Install TypeScript globally
RUN npm install -g typescript ts-node
# Expose the application port
EXPOSE 3000
# Command to run the application
CMD ["ts-node", "src/index.ts"]
```
#### 4. Create `docker-compose.yml`
Create a `docker-compose.yml` file in the root of your project:
```yaml
version: '3.8'
services:
db:
image: postgres:latest
environment:
POSTGRES_USER: user
POSTGRES_PASSWORD: password
POSTGRES_DB: mydb
ports:
- "5432:5432"
app:
build: .
volumes:
- .:/app
ports:
- "3000:3000"
environment:
DATABASE_URL: postgres://user:password@db:5432/mydb
depends_on:
- db
```

#### 5. Create `.env` File
Create a `.env` file in the root of your project:
```
DATABASE_URL=postgres://user:password@db:5432/mydb
```
#### 6. Create `src/index.ts`
Create the main application file `src/index.ts`:
```typescript
import express from 'express';
import { AppDataSource } from './ormconfig';
import { User } from './entities/User';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.get('/health', (req, res) => {
res.send('Server is running!');
});
// Connect to the database
AppDataSource.initialize()
.then(() => {
console.log('Database connected');
// Start the server
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});
})
.catch((error) => console.log('Database connection error:', error));
```

#### 7. Create `src/ormconfig.ts`
Create the TypeORM configuration file `src/ormconfig.ts`:
```typescript
import { DataSource } from 'typeorm';
import { User } from './entities/User';
export const AppDataSource = new DataSource({
type: 'postgres',
host: 'db',
port: 5432,
username: 'user',
password: 'password',
database: 'mydb',
entities: [User],
synchronize: true,
});
```
#### 8. Create `src/entities/User.ts`
Create the User entity file `src/entities/User.ts`:
```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class User {
@PrimaryGeneratedColumn()
id: number;
@Column()
name: string;
@Column()
email: string;
}
```
#### 9. Build and Run the Application
Now that everything is set up, you can build and run your application using Docker Compose. Open a terminal in the root of your project and run:
```bash
docker-compose up --build
```
This command will:
- Build the Docker image for your Node.js application.
- Start the PostgreSQL database container.
- Start the Node.js application container.
#### 10. Testing the Application
Once the containers are up and running, you can test the application:
- Open your browser or Postman and navigate to `http://localhost:3000/health`. You should see the message "Server is running!".
- You can also connect to the PostgreSQL database using a database client (like pgAdmin or DBeaver) with the following credentials:
- Host: `localhost`
- Port: `5432`
- User: `user`
- Password: `password`
- Database: `mydb`


