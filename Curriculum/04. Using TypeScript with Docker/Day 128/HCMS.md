### Healthcare management system
To create a healthcare management system with a React TypeScript frontend that connects to the previously set up Node.js backend using Axios, we will set up a new React application inside Docker. This will involve creating a new Dockerfile for the React application, configuring Docker Compose to manage both the frontend and backend services, and installing the necessary dependencies.

### Complete Setup for React TypeScript Frontend in Docker

#### 1. Project Structure

Update your project structure to include the React frontend:

```
my-fullstack-project/
│
├── backend/ # Node.js backend
│ ├── src/
│ │ ├── entities/
│ │ │ └── User.ts
│ │ ├── index.ts
│ │ └── ormconfig.ts
│ ├── .env
│ ├── docker-compose.yml
│ ├── Dockerfile
│ └── package.json
│
└── frontend/ # React frontend
├── public/
├── src/
│ ├── components/
│ ├── App.tsx
│ └── index.tsx
├── Dockerfile
├── package.json
└── .env
```

#### 2. Create React App
Navigate to the root of your project and create a new React app using Create React App with TypeScript:

```bash
npx create-react-app frontend --template typescript
```
### Explanation:
1. **npx**:
- **What it is**: `npx` is a package runner tool that comes with Node.js (specifically with npm version 5.2.0 and higher). It allows you to execute packages that are not globally installed on your system.
- **Purpose**: In this context, `npx` is used to run the `create-react-app` package without needing to install it globally. This ensures that you are using the latest version of `create-react-app` available.
2. **create-react-app**:
- **What it is**: `create-react-app` is a command-line tool that sets up a new React project with a sensible default configuration. It automates the process of configuring the build system, development server, and other essential tools needed for a React application.
- **Purpose**: This tool simplifies the initial setup of a React application, allowing developers to focus on writing code rather than configuring build tools like Webpack, Babel, etc.
3. **frontend**:
- **What it is**: This is the name of the directory that will be created for your new React application. The `create-react-app` tool will create a folder named `frontend` and set up the project files inside it.
- **Purpose**: By specifying a name, you are organizing your project structure. In this case, the frontend of your application will reside in the `frontend` directory.
4. **--template typescript**:
- **What it is**: This flag specifies that you want to use the TypeScript template when creating the React application. TypeScript is a superset of JavaScript that adds static typing, which can help catch errors during development and improve code quality.
- **Purpose**: By using the TypeScript template, the generated React application will be configured to use TypeScript out of the box. This includes:
- Setting up TypeScript configuration files (`tsconfig.json`).
- Creating files with the `.tsx` extension for React components, which allows you to use JSX syntax with TypeScript.
- Installing the necessary TypeScript dependencies, such as `typescript`, `@types/react`, and `@types/react-dom`.
#### 3. Install Dependencies
Navigate to the `frontend` directory and install Axios:
```bash
cd frontend
npm install axios
```
### What is Axios?
**Axios** is a popular JavaScript library used to make HTTP requests from a web browser or Node.js environment. It is built on top of the native `XMLHttpRequest` and provides a simple and intuitive API for handling requests and responses. Axios is often used in web applications to interact with RESTful APIs, allowing developers to send and receive data over the network.
### Key Features of Axios
1. **Promise-Based**:
- Axios uses Promises to handle asynchronous operations, making it easier to work with asynchronous code. This allows developers to use `.then()` and `.catch()` methods to handle responses and errors.
2. **Browser Compatibility**:
- Axios works in all modern browsers and can also be used in Node.js environments. It automatically handles the differences between browsers, providing a consistent API.
3. **Request and Response Interceptors**:
- Axios allows you to define interceptors that can modify requests or responses before they are handled by `then` or `catch`. This is useful for adding authentication tokens, logging, or transforming data.
4. **Automatic JSON Data Transformation**:
- Axios automatically transforms JSON data when sending requests and receiving responses. This means you can work with JavaScript objects directly without needing to manually parse or stringify JSON.
5. **Cancel Requests**:
- Axios provides a way to cancel requests using the `CancelToken` feature. This is useful for scenarios where you want to abort a request if it is no longer needed (e.g., when a user navigates away from a page).
6. **Timeouts**:
- You can set a timeout for requests, allowing you to specify how long to wait for a response before aborting the request.
7. **Customizable**:
- Axios allows you to set default configurations for requests, such as base URLs, headers, and timeouts. This makes it easy to reuse configurations across multiple requests.
8. **Support for Uploading Files**:
- Axios supports file uploads using the `FormData` API, making it easy to send files to a server.
#### 4. Create Dockerfile for React Frontend
Create a `Dockerfile` in the `frontend` directory:
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
# Build the React app
RUN npm run build
# Install serve to serve the static files
RUN npm install -g serve
# Expose the application port
EXPOSE 3000
# Command to serve the application
CMD ["serve", "-s", "build"]
```
### The `Dockerfile`:
The `Dockerfile` for the React frontend is a set of instructions that Docker uses to build an image for the React application. Each line in the `Dockerfile` specifies a command that Docker will execute to create the image. Below is a detailed explanation of each part of the `Dockerfile` you provided:

### Dockerfile Breakdown
```dockerfile
# Use the official Node.js image as a base
FROM node:14
```
- **FROM node:14**: This line specifies the base image for the Docker container. In this case, it uses the official Node.js image with version 14. This image includes Node.js and npm (Node Package Manager), which are necessary for running and building the React application.
```dockerfile
# Set the working directory
WORKDIR /app
```
- **WORKDIR /app**: This command sets the working directory inside the container to `/app`. All subsequent commands will be executed in this directory. If the directory does not exist, Docker will create it. This is where the application code will reside.
```dockerfile
# Copy package.json and package-lock.json
COPY package*.json ./
```
- **COPY package*.json ./**: This line copies the `package.json` and `package-lock.json` files from the host machine (your local development environment) to the working directory (`/app`) in the container. These files contain the metadata and dependencies required for the application.
```dockerfile
# Install dependencies
RUN npm install
```
- **RUN npm install**: This command runs `npm install` inside the container, which installs all the dependencies listed in the `package.json` file. This step is crucial because it ensures that all the necessary packages are available for the application to run.
```dockerfile
# Copy the rest of the application code
COPY . .
```
- **COPY . .**: This command copies all the remaining files and directories from the current directory on the host machine to the working directory (`/app`) in the container. This includes the source code, public assets, and any other files needed for the application.
```dockerfile
# Build the React app
RUN npm run build
```
- **RUN npm run build**: This command runs the build script defined in the `package.json` file. For a React application, this typically compiles the source code and optimizes it for production, creating a `build` directory that contains static files (HTML, CSS, JavaScript) ready to be served.
```dockerfile
# Install serve to serve the static files
RUN npm install -g serve
```
- **RUN npm install -g serve**: This command installs the `serve` package globally in the container. `serve` is a simple static file server that can be used to serve the files generated by the React build process. By installing it globally, you can use it in the command that follows.
```dockerfile
# Expose the application port
EXPOSE 3000
```
- **EXPOSE 3000**: This line informs Docker that the container will listen on port 3000 at runtime. While this does not actually publish the port, it serves as documentation and allows you to map the container's port to a port on the host machine when running the container.
```dockerfile
# Command to serve the application
CMD ["serve", "-s", "build"]
```
- **CMD ["serve", "-s", "build"]**: This command specifies the default command to run when the container starts. In this case, it runs the `serve` command with the `-s` flag (which stands for "single-page application") and points to the `build` directory. This serves the static files generated by the React build process, allowing users to access the application through a web browser.

#### 5. Update `docker-compose.yml`
Update the `docker-compose.yml` file in the root of your project to include the React frontend service:
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
build: ./backend
volumes:
- ./backend:/app
ports:
- "3001:3000" # Backend runs on port 3000 inside the container
environment:
DATABASE_URL: postgres://user:password@db:5432/mydb
depends_on:
- db
frontend:
build: ./frontend
volumes:
- ./frontend:/app
ports:
- "3000:3000" # Frontend runs on port 3000
environment:
REACT_APP_API_URL: http://localhost:3001 # Backend URL for Axios
```

#### 6. Create `.env` File for Frontend
Create a `.env` file in the `frontend` directory to store the API URL:
```
REACT_APP_API_URL=http://localhost:3001
```
#### 7. Update React App to Use Axios
In the `frontend/src/App.tsx` file, update the code to use Axios to connect to the backend:
```typescript
import React, { useEffect, useState } from 'react';
import axios from 'axios';
interface User {
id: number;
name: string;
email: string;
}
const App: React.FC = () => {
const [users, setUsers] = useState<User[]>([]);
useEffect(() => {
const fetchUsers = async () => {
try {
const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
setUsers(response.data);
} catch (error) {
console.error('Error fetching users:', error);
}
};
fetchUsers();
}, []);
return (
<div>
<h1>Healthcare Management System</h1>
<h2>Users</h2>
<ul>
{users.map(user => (
<li key={user.id}>{user.name} - {user.email}</li>
))}
</ul>
</div>
);
};
export default App;
```

#### 8. Update Backend to Serve Users
In the backend, update the `src/index.ts` file to include a route for fetching users:
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
// Route to get users
app.get('/users', async (req, res) => {
const users = await AppDataSource.getRepository(User).find();
res.json(users);
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

#### 9. Build and Run the Application
Now that everything is set up, you can build and run your application using Docker Compose. Open a terminal in the root of your project and run:
```bash
docker-compose up --build
```
This command will:
- Build the Docker images for both the Node.js backend and the React frontend.
- Start the PostgreSQL database container.
- Start the Node.js application container.
- Start the React application container.
#### 10. Testing the Application
Once the containers are up and running, you can test the application:
- Open your browser and navigate to `http://localhost:3000`. You should see the "Healthcare Management System" heading and a list of users fetched from the backend.
- If you have not added any users to the database yet, the list will be empty.

### At the core of the lesson
You now have a complete healthcare management system with a React TypeScript frontend and a Node.js backend, both running inside Docker containers. The frontend uses Axios to communicate with the backend API, and the entire setup is managed using Docker Compose. This architecture allows for easy development, testing, and deployment of your application.
