
# **Day 4 Lab: Dockerizing and Deploying Applications**

## **Estimated Time**: 2 Hours  

## **Objective**:
Containerize a full-stack application, push Docker images to Amazon ECR, and deploy the application to ECS using Fargate.

---

## **Step-by-Step Instructions**

---

### **Step 1: Write Dockerfiles**

#### React Frontend  
1. Create a `Dockerfile` in the root directory of your React application.  
2. Add the following content:  
   ```dockerfile
   FROM node:14
   WORKDIR /app
   COPY . .
   RUN npm install && npm run build
   CMD ["npx", "serve", "-s", "build"]



3.  Save and close the file.

#### Express Backend

1.  In the root directory of your backend application, create another `Dockerfile`.
2.  Add the following content:
    
    ```dockerfile
    FROM node:14
    WORKDIR /app
    COPY . .
    RUN npm install
    CMD ["node", "server.js"]
    
    ```
    
3.  Save and close the file.

**Explanation**:  
The **Dockerfile** specifies the base image, sets the working directory, copies application files, installs dependencies, and defines the command to run the application.

**Online Resource**:

-   [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)

----------

### **Step 2: Build and Test Docker Images**

#### Build Docker Images

1.  Open a terminal and navigate to the root directory of the React app. Run:
    
    ```bash
    docker build -t react-frontend .
    
    ```
    
2.  Navigate to the backend directory and run:
    
    ```bash
    docker build -t express-backend .
    
    ```
    

#### Test Docker Images Locally

1.  Run the frontend image:
    
    ```bash
    docker run -p 3000:3000 react-frontend
    
    ```
    
    Access the React app at `http://localhost:3000`.
2.  Run the backend image:
    
    ```bash
    docker run -p 4000:4000 express-backend
    
    ```
    
    Access the Express API at `http://localhost:4000`.

**Explanation**:  
Building Docker images converts your application into portable containers. Testing ensures they work correctly before deploying to AWS.

**Online Resource**:

-   [Docker Build Command](https://docs.docker.com/engine/reference/commandline/build/)

----------

### **Step 3: Push Docker Images to Amazon ECR**

#### Create ECR Repositories

1.  In the AWS Management Console, navigate to **ECR**: [ECR Console](https://console.aws.amazon.com/ecr/).
2.  Click **Create Repository**.
3.  Create repositories for:
    -   **Frontend**: `react-frontend`
    -   **Backend**: `express-backend`

#### Authenticate Docker with ECR

1.  Run the following command to log in to ECR:
    
    ```bash
    aws ecr get-login-password --region <your-region> | docker login --username AWS --password-stdin <account_id>.dkr.ecr.<your-region>.amazonaws.com
    
    ```
    

#### Tag and Push Images

1.  Tag the React image:
    
    ```bash
    docker tag react-frontend <account_id>.dkr.ecr.<your-region>.amazonaws.com/react-frontend
    
    ```
    
    Push the image to ECR:
    
    ```bash
    docker push <account_id>.dkr.ecr.<your-region>.amazonaws.com/react-frontend
    
    ```
    
2.  Tag the Express image:
    
    ```bash
    docker tag express-backend <account_id>.dkr.ecr.<your-region>.amazonaws.com/express-backend
    
    ```
    
    Push the image to ECR:
    
    ```bash
    docker push <account_id>.dkr.ecr.<your-region>.amazonaws.com/express-backend
    
    ```
    

**Explanation**:  
Amazon ECR is a secure container registry that stores Docker images for ECS deployment.

**Online Resource**:

-   [Amazon ECR Documentation](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html)

----------

### **Step 4: Deploy the Application to ECS Using Fargate**

#### Create an ECS Cluster

1.  Navigate to the **ECS** service: [ECS Console](https://console.aws.amazon.com/ecs/).
2.  Click **Create Cluster** and select **Networking only (Powered by AWS Fargate)**.
3.  Provide a cluster name (e.g., `MyAppCluster`) and click **Create**.

#### Define Task Definitions

1.  In ECS, go to **Task Definitions** and click **Create New Task Definition**.
2.  Select **Fargate** and configure the task for each service:
    -   **Frontend Task**:
        -   Add a container using the React image from ECR.
        -   Map **Port 3000** for external access.
    -   **Backend Task**:
        -   Add a container using the Express image from ECR.
        -   Map **Port 4000** for external access.

#### Create Services

1.  Navigate to **ECS Services** and create a service for each task definition.
2.  Use **Fargate** as the launch type and select the cluster created earlier.
3.  Set the desired number of tasks (e.g., 1 for each service).

**Explanation**:  
ECS with Fargate allows you to deploy and run containers without managing servers. Each service ensures the containers remain running.

**Online Resource**:

-   [Amazon ECS Documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html)

----------

### **Step 5: Verify the Deployment**

#### Check Running Tasks

1.  In the ECS console, navigate to the **Clusters** section and open your cluster.
2.  Verify that the tasks for the frontend and backend are running.

#### Test Application Access

1.  Open the public IP of the frontend container in your browser (available in the **Tasks** tab).
2.  Use the frontend to interact with the backend API.

**Explanation**:  
Testing ensures your application is running correctly and the frontend and backend are communicating.

**Online Resource**:

-   [Fargate Testing Guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_run_task.html)

----------

## **Key Learning Outcomes**:

1.  Write Dockerfiles to containerize frontend and backend applications.
2.  Push Docker images to Amazon ECR for centralized storage.
3.  Deploy containerized applications to ECS using AWS Fargate.
4.  Verify application functionality in a cloud environment.

----------
