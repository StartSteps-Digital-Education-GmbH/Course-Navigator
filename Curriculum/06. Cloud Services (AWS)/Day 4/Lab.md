
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

## **Potential Permission Requirements**

### **IAM User Permissions for ECR**

To create ECR repositories and push Docker images, ensure the user or role has the **AmazonEC2ContainerRegistryFullAccess** policy.

#### **Steps to Verify Permissions**
1. Check the attached policies for the IAM user or role.
2. If using a custom policy, include actions like:
    ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "ecr:CreateRepository",
           "ecr:PutImage",
           "ecr:GetAuthorizationToken"
         ],
         "Resource": "*"
       }
     ]
   }
  


----------

### **IAM User Permissions for ECS**

To create ECS clusters, task definitions, and services, ensure the user or role has the **AmazonECSFullAccess** policy.

#### **Steps to Verify Permissions**

1.  Confirm the attached policies include ECS access.
2.  If using a custom policy, ensure it includes actions like:
    
    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [
            "ecs:CreateCluster",
            "ecs:RegisterTaskDefinition",
            "ecs:CreateService",
            "ecs:RunTask"
          ],
          "Resource": "*"
        }
      ]
    }
    
    ```
    

----------

### **Public Access for ECS Tasks**

The ECS tasks (for React frontend and Express backend) require Security Groups allowing inbound traffic on their respective ports:

-   **Frontend**: Port 3000
-   **Backend**: Port 4000

----------

### **ECR Push and Login Commands**

Ensure the user running `docker login` has a valid **ecr:GetAuthorizationToken** permission.

----------

### **Relevant Online Resources for Potential Permission Requirements**

---

## **IAM User Permissions for ECR**

### **Policy Documentation**
- **AmazonEC2ContainerRegistryFullAccess Policy**:  
  Grants full access to manage ECR repositories, push Docker images, and obtain authorization tokens.  
  [AmazonEC2ContainerRegistryFullAccess Policy Documentation](https://docs.aws.amazon.com/AmazonECR/latest/userguide/security-iam.html#iam-policy)

### **Steps to Verify Permissions**
1. **How to View Attached Policies**:  
   Learn how to check the attached policies for an IAM user or role.  
   [Viewing IAM Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-attach-detach.html)  

2. **Creating Custom IAM Policies**:  
   Guidance for creating a custom policy to include ECR permissions such as `ecr:CreateRepository` and `ecr:PutImage`.  
   [AWS IAM Policy Creation](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html)  

3. **Using Amazon ECR**:  
   Step-by-step guide on using Amazon ECR, including pushing and pulling images.  
   [Getting Started with Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-cli.html)

---

## **IAM User Permissions for ECS**

### **Policy Documentation**
- **AmazonECSFullAccess Policy**:  
  Provides full access to manage ECS clusters, task definitions, services, and tasks.  
  [AmazonECSFullAccess Policy Documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam.html)

### **Steps to Verify Permissions**
1. **Checking Attached Policies**:  
   Learn how to check if a user or role has access to ECS services.  
   [Viewing IAM Permissions](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-attach-detach.html)

2. **Creating Custom ECS IAM Policies**:  
   Guide for creating a policy with specific actions like `ecs:CreateCluster` and `ecs:RegisterTaskDefinition`.  
   [Custom ECS Policies Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_examples.html#iam-policy-example-ecs)

3. **ECS Role Requirements**:  
   Ensure the IAM role assigned to ECS tasks has proper permissions.  
   [ECS Task Role Permissions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html)

---

## **Public Access for ECS Tasks**

### **Security Group Configuration**
1. **Allowing Inbound Traffic**:  
   Learn how to allow specific ports (e.g., 3000 for frontend, 4000 for backend) in Security Groups.  
   [AWS Security Group Configuration](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html#sg-add-rule)  

2. **Best Practices for Security Groups**:  
   Guidance on securely configuring Security Groups for ECS tasks.  
   [AWS Security Group Best Practices](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html#sg-best-practices)  

---

## **ECR Push and Login Commands**

### **Authenticating with Amazon ECR**
1. **Docker Login for ECR**:  
   Documentation on obtaining an authorization token to log in to ECR with `ecr:GetAuthorizationToken`.  
   [Amazon ECR Docker Login](https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html)

2. **Required IAM Permissions for ECR Push**:  
   Ensure the user has `ecr:GetAuthorizationToken` and `ecr:PutImage` permissions.  
   [Amazon ECR Permissions Reference](https://docs.aws.amazon.com/AmazonECR/latest/userguide/ecr-supported-iam-actions.html)

---




## **Key Learning Outcomes**:

1.  Write Dockerfiles to containerize frontend and backend applications.
2.  Push Docker images to Amazon ECR for centralized storage.
3.  Deploy containerized applications to ECS using AWS Fargate.
4.  Verify application functionality in a cloud environment.

----------
