# Guide: Deploy Dockerized Express Backend with Amazon ECR, ECS, and Fargate

This guide provides detailed steps to deploy your Dockerized Express backend using **Amazon Elastic Container Registry (ECR)**, **Elastic Container Service (ECS)**, and **Fargate**. It includes both **AWS Console** and **AWS CLI** methods.

---

## **1. Push Your Docker Image to Amazon ECR**
Amazon ECR is a container image registry for storing Docker images.

### **Using AWS CLI**

#### **Step 1.1: Create an ECR Repository**
```bash
aws ecr create-repository --repository-name express-backend --region us-east-1
```
- Note the repository URI from the output (e.g., `123456789012.dkr.ecr.us-east-1.amazonaws.com/express-backend`).

#### **Step 1.2: Authenticate Docker with ECR**
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
```

#### **Step 1.3: Build, Tag, and Push Your Docker Image**
1. Build your Docker image:
   ```bash
   docker build -t express-backend .
   ```
2. Tag the image for ECR:
   ```bash
   docker tag express-backend:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/express-backend:latest
   ```
3. Push the image to ECR:
   ```bash
   docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/express-backend:latest
   ```

### **Using AWS Console**

#### **Step 1.1: Create an ECR Repository**
1. Navigate to the **ECR** service in the AWS Console.
2. Click **Create repository**.
3. Enter the repository name (e.g., `express-backend`) and click **Create**.

#### **Step 1.2: Authenticate Docker with ECR**
1. Select the newly created repository.
2. Click **View push commands**.
3. Follow the commands to log in, build, tag, and push your image.

---

## **2. Create an ECS Cluster**
ECS manages your containerized application.

### **Using AWS CLI**
1. Create a new ECS cluster:
   ```bash
   aws ecs create-cluster --cluster-name express-backend-cluster
   ```
2. Verify the cluster creation:
   ```bash
   aws ecs describe-clusters --clusters express-backend-cluster
   ```

### **Using AWS Console**
1. Navigate to the **ECS** service in the AWS Console.
2. Click **Create Cluster**.
3. Choose **Networking only** and click **Next step**.
4. Enter the cluster name (e.g., `express-backend-cluster`) and click **Create**.

---

## **3. Create a Task Definition**
The task definition specifies how to run your container.

### **Using AWS CLI**
1. Save the following as `task-definition.json`:
   ```json
   {
       "family": "express-backend-task",
       "networkMode": "awsvpc",
       "containerDefinitions": [
           {
               "name": "express-backend",
               "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/express-backend:latest",
               "memory": 512,
               "cpu": 256,
               "essential": true,
               "portMappings": [
                   {
                       "containerPort": 5000,
                       "hostPort": 5000,
                       "protocol": "tcp"
                   }
               ],
               "environment": [
                   {
                       "name": "DATABASE_URL",
                       "value": "your-rds-database-url"
                   }
               ]
           }
       ],
       "requiresCompatibilities": ["FARGATE"],
       "cpu": "256",
       "memory": "512",
       "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole"
   }
   ```
2. Register the task definition:
   ```bash
   aws ecs register-task-definition --cli-input-json file://task-definition.json
   ```

### **Using AWS Console**
1. Navigate to **ECS > Task Definitions** and click **Create new task definition**.
2. Choose **FARGATE** and click **Next step**.
3. Fill in the following:
   - Task definition name: `express-backend-task`.
   - Container name: `express-backend`.
   - Image: `123456789012.dkr.ecr.us-east-1.amazonaws.com/express-backend:latest`.
   - Memory and CPU: 512 MiB and 256 units.
   - Port mapping: 5000.
4. Add an **execution role** with permissions and click **Create**.

---

## **4. Create a Fargate Service**
Fargate runs your task without managing the underlying servers.

### **Using AWS CLI**
1. Create the service:
   ```bash
   aws ecs create-service \
       --cluster express-backend-cluster \
       --service-name express-backend-service \
       --task-definition express-backend-task \
       --desired-count 1 \
       --launch-type FARGATE \
       --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxxx],securityGroups=[sg-xxxxxx],assignPublicIp=ENABLED}"
   ```
   Replace `subnet-xxxxxx` and `sg-xxxxxx` with your VPC subnet and security group.

### **Using AWS Console**
1. Navigate to **ECS > Clusters > express-backend-cluster**.
2. Click **Create Service**.
3. Select **Launch type: Fargate**.
4. Specify the task definition, service name, and desired count.
5. Configure the network:
   - Subnets: Select public subnets.
   - Security groups: Allow inbound traffic on port 5000.
6. Click **Create Service**.

---

## **5. Set Up a Load Balancer (Optional)**
To expose your application to the internet, use an **Application Load Balancer (ALB)**.

### **Using AWS CLI**
1. Create a load balancer:
   ```bash
   aws elbv2 create-load-balancer --name express-backend-alb --subnets subnet-xxxxxx subnet-yyyyyy --security-groups sg-xxxxxx
   ```
2. Register a target group:
   ```bash
   aws elbv2 create-target-group \
       --name express-backend-tg \
       --protocol HTTP \
       --port 5000 \
       --vpc-id vpc-xxxxxx
   ```
3. Create a listener:
   ```bash
   aws elbv2 create-listener \
       --load-balancer-arn arn:aws:elasticloadbalancing:region:account-id:loadbalancer/app/express-backend-alb \
       --protocol HTTP \
       --port 80 \
       --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:region:account-id:targetgroup/express-backend-tg
   ```
4. Update the ECS service to use the target group:
   ```bash
   aws ecs update-service \
       --cluster express-backend-cluster \
       --service-name express-backend-service \
       --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:region:account-id:targetgroup/express-backend-tg,containerName=express-backend,containerPort=5000"
   ```

### **Using AWS Console**
1. Navigate to **EC2 > Load Balancers**.
2. Create an Application Load Balancer and register your subnets and security groups.
3. Create a Target Group for port 5000.
4. Set up a listener for the ALB to forward traffic to the Target Group.
5. Attach the Target Group to the ECS service.

---

## **6. Verify Deployment**

### **6.1 Check Logs and Status**

#### **Using AWS CLI**
1. Verify service status:
   ```bash
   aws ecs describe-services --cluster express-backend-cluster --services express-backend-service
   ```

2. Verify task status:
   ```bash
   aws ecs describe-tasks --cluster express-backend-cluster --tasks <task-id>
   ```

3. Check logs:
   ```bash
   aws logs get-log-events \
       --log-group-name /aws/ecs/express-backend-cluster \
       --log-stream-name <log-stream-name>
   ```

#### **Using AWS Console**
1. Navigate to **ECS > Clusters > express-backend-cluster**.
2. Select **Tasks** and check the status.
3. Navigate to **CloudWatch > Log Groups** and view the logs for your ECS task.

### **6.2 Test Endpoints Without Load Balancer**

1. Get the public IP of your task:
   - Using CLI:
     ```bash
     aws ecs describe-tasks --cluster express-backend-cluster --tasks <task-id>
     ```
     Look for `privateIPv4Address`.

   - Using Console:
     - Go to **ECS > Clusters > Tasks**.
     - Select the task and find **Network Interface** → **Public IP**.

2. Test using curl or Postman:
   ```bash
   curl http://<public-ip>:5000
   ```

### **6.3 Test Endpoints with Load Balancer**

1. Get the DNS name of the load balancer:
   - Using CLI:
     ```bash
     aws elbv2 describe-load-balancers --names express-backend-alb
     ```
     Look for the `DNSName` field.

   - Using Console:
     - Navigate to **EC2 > Load Balancers**.
     - Select your ALB and find the DNS name in the details.

2. Test using curl or Postman:
   ```bash
   curl http://<load-balancer-dns-name>
   ```

---

## **7. Set Up Required IAM Roles**
IAM roles provide permissions for ECS and Fargate.

### **Using AWS CLI**
1. Create an IAM role for ECS tasks:
   ```bash
   aws iam create-role --role-name ecsTaskExecutionRole --assume-role-policy-document file://trust-policy.json
   ```
   Save the following as `trust-policy.json`:
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Effect": "Allow",
               "Principal": {
                   "Service": "ecs-tasks.amazonaws.com"
               },
               "Action": "sts:AssumeRole"
           }
       ]
   }
   ```

2. Attach required policies:
   ```bash
   aws iam attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
   ```

3. Update your task definition to use the `ecsTaskExecutionRole`.

### **Using AWS Console**
1. Navigate to **IAM > Roles** and click **Create role**.
2. Select **ECS Task** and click **Next**.
3. Attach the policy **AmazonECSTaskExecutionRolePolicy**.
4. Create the role and name it `ecsTaskExecutionRole`.

---

This completes the deployment guide. You can now access your backend via the load balancer DNS or the task public IP.

