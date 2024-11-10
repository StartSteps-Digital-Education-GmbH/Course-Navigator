## Introduction to Docker - Absolute Beginner Level

[A Docker Tutorial for Beginners](https://docker-curriculum.com/)

### Session 1: Introduction to Containers and Docker (45 minutes)

#### Theory (20 minutes)

1. **What is Containerization?**
   - **Definition**: Containerization is a lightweight form of virtualization that allows you to run applications in isolated environments called containers. Unlike traditional virtual machines (VMs), which require a full operating system to run, containers share the host operating system's kernel.
   - **Key Differences from Virtual Machines**:
     - **Resource Efficiency**: Containers are more lightweight than VMs because they share the host OS kernel. This means they use fewer resources and can start up much faster.
     - **Startup Time**: Containers can start in seconds, while VMs can take minutes to boot up.
     - **Portability**: Containers encapsulate everything needed to run an application, making them portable across different environments (development, testing, production).

2. **Benefits of Containerization**:
   - **Resource Isolation**: Each container runs in its own environment, preventing conflicts between applications.
   - **Ease of Deployment**: Applications can be packaged with their dependencies, making it easier to deploy them consistently across different environments.
   - **Scalability**: Containers can be easily replicated to handle increased load, allowing for efficient scaling of applications.

3. **Docker's Role in the Ecosystem**:
   - **Introduction to Docker**: Docker is a platform that enables developers to build, ship, and run applications in containers. It simplifies the process of managing containers and provides tools for creating and sharing containerized applications.
   - **Popularity and Community Support**: Docker has become the de facto standard for containerization, with a large community and extensive documentation, making it easier for developers to adopt and use.

#### Practice (25 minutes)

1. **Installing Docker**:
   - **Windows**:
     - Instruct learners to download Docker Desktop from the [Docker website](https://www.docker.com/products/docker-desktop) and follow the installation instructions.
   - **Mac**:
     - Similar to Windows, guide learners through the installation of Docker Desktop.
   - **Linux (Ubuntu)**:
     - Provide a step-by-step installation guide:
     ```bash
     sudo apt update
     sudo apt install docker.io
     sudo systemctl start docker
     sudo systemctl enable docker
     ```
     **Explanation**: This command updates the package list, installs Docker, starts the Docker service, and ensures it starts on boot.

2. **Verifying Installation**:
   - Have learners run the following command to verify Docker is installed correctly:
   ```bash
   docker --version
   ```
   **Explanation**: This command checks the installed version of Docker, confirming that the installation was successful.

3. **Running Docker without sudo (Linux)**:
   - Explain how to add the current user to the Docker group to avoid using `sudo` for every command:
   ```bash
   sudo usermod -aG docker $USER
   ```
   **Explanation**: This command adds the user to the Docker group, allowing them to run Docker commands without needing superuser privileges. Instruct learners to log out and back in for the changes to take effect.

4. **Running a Test Container**:
   - Have learners run a simple test container to ensure everything is working:
   ```bash
   docker run hello-world
   ```
   **Explanation**: This command runs the `hello-world` container, which outputs a message confirming that Docker is working correctly. It pulls the image from DockerHub if it is not already available locally.

### Session 2: Key Concepts in Docker (45 minutes)

#### Theory (20 minutes)

1. **Understanding Docker Images**:
   - **Definition**: A Docker image is a read-only template that contains the application code, libraries, and dependencies needed to run an application. Images are built in layers, with each layer representing a change or addition to the image.
   - **Layers**: Each command in a Dockerfile creates a new layer in the image. This layering system allows for efficient storage and sharing of images, as unchanged layers can be reused across different images.

2. **Containers**:
   - **Definition**: A container is a runnable instance of a Docker image. When you run an image, it creates a container that can be started, stopped, and modified.
   - **Lifecycle of a Container**:
     - **Created**: The container is created but not yet running.
     - **Running**: The container is actively executing.
     - **Stopped**: The container has been stopped but can be restarted.
     - **Removed**: The container is deleted and cannot be restarted.

3. **Docker Registries**:
   - **Definition**: A Docker registry is a storage and distribution system for Docker images. DockerHub is the default public registry where users can find and share images.
   - **Searching for Images**: Users can search for images on DockerHub using the Docker CLI or the DockerHub website.

#### Practice (25 minutes)

1. **Pulling and Running a Docker Image**:
   - Have learners pull the `hello-world` image:
   ```bash
   docker pull hello-world
   ```
   **Explanation**: This command downloads the `hello-world` image from DockerHub to the local machine.

2. **Running the Image**:
   - Instruct learners to run the image:
   ```bash
   docker run hello-world
   ```
   **Explanation**: This command creates and runs a container from the `hello-world` image, which outputs a message confirming that Docker is working.

3. **Exploring Docker Images**:
   - Show how to list all downloaded images:
   ```bash
   docker images
   ```
   **Explanation**: This command displays all images available locally, including their repository names, tags, and sizes.

4. **Running a Container in Interactive Mode**:
   - Demonstrate running a container interactively:
   ```bash
   docker run -it ubuntu /bin/bash
   ```
   **Explanation**: This command runs an Ubuntu container and opens a bash shell, allowing learners to interact with the container. They can run commands inside the container, such as `ls` to list files.

5. **Exiting the Interactive Shell**:
   - Instruct learners to exit the interactive shell by typing `exit` or pressing `Ctrl + D`.

### Session 3: Building and Running a Docker Container (45 minutes)

#### Theory (20 minutes)

1. **What is a Dockerfile?**:
   - **Definition**: A Dockerfile is a script containing a series of instructions to build a Docker image. It defines the environment in which the application will run.
   - **Importance**: Dockerfiles allow for reproducibility and version control, making it easy to recreate the same environment across different machines.

2. **Key Dockerfile Commands**:
   - **FROM**: Specifies the base image to use for the new image.
   - **RUN**: Executes commands in the image during the build process (e.g., installing packages).
   - **COPY**: Copies files from the host machine to the image.
   - **CMD**: Specifies the command to run when the container starts.

#### Practice (25 minutes)

1. **Creating a Simple TypeScript Application**:
   - Guide learners to create a simple TypeScript application:
     - Create a directory for the project:
     ```bash
     mkdir my-typescript-app && cd my-typescript-app
     ```
     - Initialize a new Node.js project:
     ```bash
     npm init -y
     ```
     **Explanation**: This command creates a `package.json` file with default settings.

     - Install TypeScript:
     ```bash
     npm install typescript --save-dev
     ```
     **Explanation**: This command installs TypeScript as a development dependency.

     - Create a simple TypeScript file (`index.ts`):
     ```typescript
     console.log("Hello, Docker with TypeScript!");
     ```
     **Explanation**: This file contains a simple TypeScript program that prints a message to the console.

     - Create a `tsconfig.json` file:
     ```json
     {
       "compilerOptions": {
         "target": "es6",
         "module": "commonjs"
       }
     }
     ```
     **Explanation**: This configuration file specifies the TypeScript compiler options.

2. **Creating a Dockerfile**:
   - Create a Dockerfile in the project directory:
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
   RUN npx tsc

   # Command to run the application
   CMD ["node", "dist/index.js"]
   ```
   **Explanation**: This Dockerfile sets up a Node.js environment, installs dependencies, builds the TypeScript application, and specifies the command to run the application.

3. **Building the Docker Image**:
   - Show how to build the Docker image:
   ```bash
   docker build -t my-typescript-app .
   ```
   **Explanation**: This command builds the Docker image using the Dockerfile in the current directory and tags it as `my-typescript-app`.

4. **Running the Docker Container**:
   - Instruct learners to run the newly created image:
   ```bash
   docker run my-typescript-app
   ```
   **Explanation**: This command runs the `my-typescript-app` container, which executes the TypeScript application and prints the message to the console.

### Session 4: Basic Docker Commands and Container Management (45 minutes)

#### Theory (20 minutes)

1. **Core Docker Commands**:
   - **docker run**: Creates and starts a container from an image.
   - **docker ps**: Lists running containers. Use `docker ps -a` to list all containers, including stopped ones.
   - **docker stop**: Stops a running container.
   - **docker start**: Starts a stopped container.
   - **docker rm**: Removes a container.

2. **Troubleshooting**:
   - Discuss common issues and how to troubleshoot them:
     - **Checking Logs**: Use `docker logs <container_id>` to view the logs of a container.
     - **Inspecting Containers**: Use `docker inspect <container_id>` to get detailed information about a container.

#### Practice (25 minutes)

1. **Running a New Container**:
   - Have learners run a new Nginx container:
   ```bash
   docker run -d --name my-nginx -p 8080:80 nginx
   ```
   **Explanation**: This command runs an Nginx container in detached mode (`-d`) and maps port 80 in the container to port 8080 on the host. This allows learners to access the Nginx server via `http://localhost:8080`.

2. **Managing the Nginx Container**:
   - **Stopping the Container**:
   ```bash
   docker stop my-nginx
   ```
   **Explanation**: This command stops the running Nginx container.

   - **Starting the Container Again**:
   ```bash
   docker start my-nginx
   ```
   **Explanation**: This command starts the stopped Nginx container.

   - **Removing the Container**:
   ```bash
   docker rm my-nginx
   ```
   **Explanation**: This command removes the Nginx container, freeing up resources.

3. **Exploring Running Containers**:
   - Show how to list all running containers:
   ```bash
   docker ps
   ```
   **Explanation**: This command displays all currently running containers, including their IDs, names, and status.

   - Show how to list all containers (including stopped ones):
   ```bash
   docker ps -a
   ```
   **Explanation**: This command displays all containers, regardless of their state.

4. **Checking Container Logs**:
   - Instruct learners to check the logs of a container (if applicable):
   ```bash
   docker logs <container_id>
   ```
   **Explanation**: This command retrieves the logs for the specified container, which can help in troubleshooting.

### Summary
By the end of Day 1, learners will have a comprehensive understanding of Docker, including the concepts of containerization, how to install Docker, manage images and containers, create a simple TypeScript application using Docker, and utilize essential Docker commands for container management. Each session is designed to blend theoretical concepts with practical coding examples, ensuring a well-rounded introduction to Docker. This detailed approach will help learners grasp the foundational concepts and gain hands-on experience with Docker.
