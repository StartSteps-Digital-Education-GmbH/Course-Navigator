## Introduction to Docker - Absolute Beginner Level

### Session 1: Introduction to Containers and Docker
- **Theory**: 
  - **Containerization**: Explain what containerization is and how it differs from virtual machines. Highlight benefits such as resource isolation, ease of deployment, and scalability.
  - **Docker's Role**: Provide a brief overview of Docker's role in the container ecosystem, emphasizing its popularity and community support.
  
- **Practice**:
  - **Installation**: Show how to install Docker on different platforms (Windows, Linux, Mac).
  - **Step-by-Step Setup**: 
    - **Command**: Install Docker on Ubuntu
    ```bash
    sudo apt update && sudo apt install docker.io
    ```
    **Explanation**: This command updates the package list and installs Docker on an Ubuntu system.

### Session 2: Key Concepts in Docker
- **Theory**: 
  - **Images, Containers, and Registries**: Discuss the concepts of Docker images, containers, and registries. Explain how Docker images are built, pulled, and used to create containers.
  - **DockerHub**: Introduce DockerHub as an image repository where users can find and share images.

- **Practice**:
  - **Pulling and Running an Image**: 
    - **Command**: Pull and run a basic Docker image
    ```bash
    docker run hello-world
    ```
    **Explanation**: This command pulls the `hello-world` image from DockerHub and runs it, providing a simple confirmation that Docker is working.

### Session 3: Building and Running a Docker Container
- **Theory**: 
  - **Dockerfiles**: Explain what Dockerfiles are and how they are used to create custom images. Describe key commands such as `FROM`, `RUN`, and `CMD`.
  - **Reproducibility**: Discuss the importance of Dockerfile configuration for container reproducibility.

- **Practice**:
  - **Creating a Dockerfile for a TypeScript Application**:
    - **Dockerfile**:
    ```dockerfile
    # Use the official Node.js image as a base
    FROM node:14

    # Set the working directory
    WORKDIR /usr/src/app

    # Copy package.json and package-lock.json
    COPY package*.json ./

    # Install dependencies
    RUN npm install

    # Copy the rest of the application code
    COPY . .

    # Build the TypeScript application
    RUN npm run build

    # Command to run the application
    CMD ["node", "dist/index.js"]
    ```
    **Explanation**: This Dockerfile sets up a Node.js environment, installs dependencies, builds a TypeScript application, and specifies the command to run the application.

### Session 4: Basic Docker Commands and Container Management
- **Theory**: 
  - **Core Docker Commands**: Introduce essential Docker commands for managing containers, including `docker run`, `docker stop`, `docker start`, and `docker rm`.
  - **Troubleshooting**: Discuss common troubleshooting steps when interacting with Docker containers.

- **Practice**:
  - **Managing Containers**:
    - **Commands**:
    ```bash
    # Run a new container
    docker run -d --name my-nginx nginx

    # Stop the container
    docker stop my-nginx

    # Start the container again
    docker start my-nginx

    # Remove the container
    docker rm my-nginx
    ```
    **Explanation**: These commands demonstrate how to run, stop, start, and remove a Docker container named `my-nginx` using the official Nginx image.

### Summary
By the end of Day 1, learners will have a foundational understanding of Docker, including the concepts of containerization, how to install Docker, manage images and containers, and create a simple TypeScript application using Docker. Each session blends theoretical concepts with practical coding examples to reinforce learning.
