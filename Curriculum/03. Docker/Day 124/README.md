## Learning plan for Day 124:

The plan is focusing on the Dockerization of the Travel Booking System. This plan will start with an introduction to Dockerization, followed by a simple TypeScript code example, and then dive into the Dockerization of the Travel Booking System.

### Reference: [Dockerize Your TypeScript Application](https://chinwendu.medium.com/how-to-dockerize-your-typescript-application-with-multi-stage-build-a-step-by-step-guide-56e7c4274088)

## Abstract
The approach to using Docker in development can vary based on the specific needs of a project and the preferences of the development team. Here are the two common approaches regarding development inside Docker versus migrating code to Docker:

### 1. Developing Inside Docker

**Description**: In this approach, developers run their development environment inside Docker containers. This means that the code is developed, tested, and run within the containerized environment.

**Advantages**:

- **Consistency**: Developers can ensure that everyone on the team is using the same environment, which reduces the "it works on my machine" problem. This is particularly useful when working with different operating systems or configurations.

- **Isolation**: Each project can have its own dependencies and configurations without interfering with other projects. This is especially beneficial when working on multiple projects that require different versions of libraries or tools.

- **Easy Setup**: New team members can quickly get up and running by simply pulling the Docker image and running the container, rather than having to configure their local environment manually.

**Use Cases**:

- When the application has complex dependencies that need to be isolated.

- When the development team is distributed and needs a consistent environment.

- When working with microservices, where each service can be developed and tested in its own container.

**Example**: A developer might use a Dockerfile to set up a development environment for a Node.js application, including all necessary dependencies, and then run the application inside a container.

### 2. Migrating Code to Docker *' Dockerization '*

**Description**: In this approach, developers write and test their code locally on their machines and then package the application into a Docker container for deployment. The development environment may not necessarily be inside Docker.

**Advantages**:

- **Familiarity**: Developers can use their preferred local development tools and IDEs without the overhead of running everything inside a container.

- **Performance**: Running code directly on the host machine can sometimes be faster than running it inside a container, especially for resource-intensive tasks.

- **Simplicity**: For simpler applications or smaller teams, it may be easier to develop locally and then containerize the application for deployment.

**Use Cases**:

- When the application is relatively simple and does not have complex dependencies.

- When the development team is small and can easily manage local environments.

- When rapid prototyping is needed, and developers want to iterate quickly without the overhead of containerization.

**Example**: A developer might write a Python application locally, test it, and then create a Docker image to deploy it to a production environment.

### Conclusion

In summary, whether to develop inside Docker or migrate code to Docker depends on the specific requirements of the project, the team's workflow, and the complexity of the application. Many teams adopt a hybrid approach, where they may develop locally but use Docker for testing, staging, and production deployments. Ultimately, the goal is to leverage Docker's benefits to improve consistency, isolation, and deployment efficiency while maintaining a productive development workflow.

##  Dockerizing the Travel Booking System

### Session 1: Introduction to Dockerization (45 minutes)

#### Theory (20 minutes)

1. **What is Dockerization?**

- **Definition**: Dockerization is the process of packaging an application and its dependencies into a Docker container. This allows the application to run consistently across different environments, such as development, testing, and production.

- **Benefits of Dockerization**:

- **Consistency**: Docker ensures that the application runs the same way regardless of where it is deployed, eliminating environment-related issues.

- **Isolation**: Each application runs in its own container, preventing conflicts between applications and their dependencies.

- **Scalability**: Docker containers can be easily replicated to handle increased load, making it easier to scale applications.

2. **Key Concepts in Dockerization**:

- **Docker Images**: A Docker image is a read-only template that contains the application code, libraries, and dependencies needed to run the application.

- **Docker Containers**: A container is a runnable instance of a Docker image. It is created from an image and can be started, stopped, and modified.

- **Dockerfile**: A Dockerfile is a script containing a series of instructions for building a Docker image. It defines the environment in which the application will run.

3. **Dockerization Workflow**:

- **Step 1**: Create a Dockerfile that specifies how to build the Docker image.

- **Step 2**: Build the Docker image using the Dockerfile.

- **Step 3**: Run a container from the built image.

- **Step 4**: Test the application running inside the container.

#### Practice (25 minutes)

1. **Simple TypeScript Code Example**:

- Before diving into the Travel Booking System, let’s create a simple TypeScript application that demonstrates mathematical operations using classes and functions.

- **Create a Directory for the Example**:

```bash
mkdir math-app && cd math-app
```

- **Initialize a New Node.js Project**:

```bash
npm init -y
```

- **Install TypeScript**:

```bash
npm install typescript --save-dev
```

- **Create a TypeScript Configuration File**:

```json
// tsconfig.json
{
"compilerOptions": {
"target": "ES6",
"module": "commonjs",
"outDir": "./dist",
"strict": true
},
"include": ["src/**/*"],
"exclude": ["node_modules"]
}
```

- **Create a Simple Math Class**:

- Create a directory named `src` and a file named `math.ts` inside it:

```typescript
// src/math.ts
export class MathOperations {
static add(a: number, b: number): number {
return a + b;
}

static subtract(a: number, b: number): number {
return a - b;
}

static multiply(a: number, b: number): number {
return a * b;
}

static divide(a: number, b: number): number {
if (b === 0) {
throw new Error("Cannot divide by zero");
}
return a / b;
}
}

// Example usage
const resultAdd = MathOperations.add(5, 3);
console.log(`Addition Result: ${resultAdd}`);
```

- **Compile and Run the TypeScript Code**:

- Add a build script to `package.json`:

```json
"scripts": {
"build": "tsc",
"start": "node dist/math.js"
}
```

- Run the following commands:
```bash
npm run build
npm start
```

**Explanation**: This simple TypeScript application defines a `MathOperations` class with static methods for basic arithmetic operations. It demonstrates how to structure TypeScript code and compile it to JavaScript.

### Session 2: Dockerizing the Simple Math Application (45 minutes)

#### Theory (20 minutes)

1. **Creating a Dockerfile for the Math Application**:

- A Dockerfile is essential for defining how the application will be built and run inside a Docker container.

- **Key Instructions**:
- **FROM**: Specifies the base image (e.g., Node.js).
- **WORKDIR**: Sets the working directory inside the container.
- **COPY**: Copies files from the host to the container.
- **RUN**: Executes commands (e.g., installing dependencies).
- **CMD**: Specifies the command to run when the container starts.

2. **Multi-Stage Builds**:

- Multi-stage builds allow you to create smaller images by separating the build environment from the runtime environment. This is particularly useful for applications that require compilation, such as TypeScript applications.

#### Practice (25 minutes)

1. **Creating the Dockerfile**:

- In the root of the `math-app` directory, create a file named `Dockerfile` with the following content:

```dockerfile
# Stage 1: Build the application
FROM node:16 AS builder
# Set the working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application code
COPY . .
# Build the TypeScript application
RUN npm run build
# Stage 2: Run the application
FROM node:16 AS runner
# Set the working directory
WORKDIR /app
# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
# Command to run the application
CMD ["node", "dist/math.js"]
```

**Explanation**: This Dockerfile uses a multi-stage build to compile the TypeScript code and create a lightweight image for running the application.

2. **Creating a `.dockerignore` File**:

- Instruct learners to create a `.dockerignore` file in the root of the project with the following content:

```
node_modules
npm-debug.log
Dockerfile
.dockerignore
```

3. **Building the Docker Image**:

- Instruct learners to build the Docker image using the following command:

```bash
docker build -t math-app .
```

4. **Running the Docker Container**:

- Have learners run the container using the following command:

```bash
docker run math-app
```

**Explanation**: This command runs the `math-app` container, which executes the TypeScript application and prints the result of the addition operation to the console.

### Session 3: Dockerizing the Travel Booking System (45 minutes)

#### Theory (20 minutes)

1. **Understanding the Travel Booking System**:

- The Travel Booking System consists of multiple services (user, flight, booking) that need to be containerized. Each service will have its own Dockerfile and can be managed independently.

2. **Dockerization Workflow for the Travel Booking System**:

- **Step 1**: Create a Dockerfile for each service.
- **Step 2**: Build Docker images for each service.
- **Step 3**: Run containers for each service.
- **Step 4**: Test the application to ensure all services are working together.

#### Practice (25 minutes)

1. **Creating Dockerfiles for Each Service**:

- In the `travel-booking-system` directory, create a Dockerfile for the user service:

```dockerfile
# travel-booking-system/src/user-service/Dockerfile
FROM node:16 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM node:16 AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

- Repeat the process for the flight service and booking service, adjusting the paths as necessary.

2. **Building Docker Images for Each Service**:

- Instruct learners to build the Docker images for each service:

```bash
# For user service
cd src/user-service
docker build -t user-service .
# For flight service
cd ../flight-service
docker build -t flight-service .
# For booking service
cd ../booking-service
docker build -t booking-service .
```

3. **Running Docker Containers for Each Service**:

- Have learners run the containers for each service:

```bash
# Run user service
docker run -p 3001:3000 user-service
# Run flight service
docker run -p 3002:3000 flight-service
# Run booking service
docker run -p 3003:3000 booking-service
```

**Explanation**: This command runs each service in its own container, mapping the internal ports to the host machine.

### Session 4: Testing and Best Practices for Dockerized Applications (45 minutes)

#### Theory (20 minutes)

1. **Testing the Dockerized Application**:

- After running the containers, it’s essential to test the application to ensure that all services are functioning correctly and can communicate with each other.

- Use tools like Postman or curl to send requests to the API endpoints of each service.

2. **Best Practices for Dockerizing Applications**:

- **Use Multi-Stage Builds**: This reduces the size of the final image by separating the build environment from the runtime environment.

- **Keep Images Small**: Only include necessary files and dependencies in the final image to improve performance and security.

- **Use Environment Variables**: Store sensitive information (e.g., database credentials) in environment variables instead of hardcoding them in the application.

3. **Managing Environment Variables**:

- Environment variables can be defined in a `.env` file and accessed in the application using `process.env`. This allows for easy configuration of different environments (development, testing, production).

#### Practice (25 minutes)

1. **Creating a `.env` File**:

- Instruct learners to create a `.env` file in the root of the project with the following content:

```
USER_SERVICES_PATH=3001
FLIGHT_SERVICES_PATH=3002
MONGODB_URI=mongodb+srv://<user>:<password>@<DB>.<server>.mongodb.net/?retryWrites=true&w=majority&appName=<DB>
```

2. **Testing the Application**:

- Instruct learners to test the application by sending requests to the API endpoints using Postman or curl. For example, to test the user signup endpoint:

```bash
curl -X POST http://localhost:3001/api/users/signup -H "Content-Type: application/json" -d '{"name": "test user", "email": "test@example.com", "password": "password123"}'
```

3. **Using Docker Compose (Optional)**:

- If time permits, introduce Docker Compose by creating a `docker-compose.yml` file to manage multiple services. Here’s a simple example:

```yaml
version: '3'
services:
user-service:
build:
context: .
dockerfile: src/user-service/Dockerfile
ports:
- "3001:3000"
env_file:
- .env
flight-service:
build:
context: .
dockerfile: src/flight-service/Dockerfile
ports:
- "3002:3000"
env_file:
- .env
booking-service:
build:
context: .
dockerfile: src/booking-service/Dockerfile
ports:
- "3003:3000"
env_file:
- .env
```

### Summary

By the end of the Day, learners will have a comprehensive understanding of how to Dockerize a TypeScript application, including creating Dockerfiles, building and running Docker images, and testing the application. They will also learn best practices for Dockerizing applications and how to manage environment variables. Each session is designed to provide a blend of theoretical concepts and practical exercises, ensuring that learners gain hands-on experience with Docker and TypeScript.
