#  Full-Stack Application Deployment on AWS Cloud  
**Duration**: 10 Days (2 Sessions per Day each session 2 TUs: Theory + Hands-On Lab)  

---

## **Day 1: Introduction to AWS and Core Concepts**

### **Session 1: Theory**
- Introduction to Cloud Computing and AWS.  
- Key AWS services overview.  
- Navigating the AWS Management Console and CLI.  

### **Session 2: Hands-On Lab**
- Set up an AWS account.  
- Create IAM users, groups, and roles.  
- Apply least privilege access policies.  

### **External Resources**:
1. [What is Cloud Computing?](https://aws.amazon.com/what-is-cloud-computing/) 
2.  [AWS Overview](https://aws.amazon.com/what-is-aws/) 
3.  [Getting Started with the AWS Management Console](https://docs.aws.amazon.com/awsconsolehelpdocs/latest/gsg/getting-started.html) 
4. [AWS CLI User Guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) 
5. [IAM User Guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html)


### **Key Learning Outcomes**:
- Understand the basics of cloud computing and AWS.  
- Gain familiarity with IAM for secure access management.  
- Learn how to navigate the AWS console and CLI.

---

## **Day 2: Storage and Static Hosting**

### **Session 1: Theory**
- Introduction to **Amazon S3** for object storage.  
- Use cases for S3: static hosting, backups, logging.  
- Overview of **CloudFront** as a CDN.  

### **Session 2: Hands-On Lab**
- Create and configure an S3 bucket for hosting React assets.  
- Set up a CloudFront distribution to serve static assets globally.  

### **External Resources**: 
1. [Amazon S3 Introduction](https://aws.amazon.com/s3/) 
2.  [S3 Bucket Configuration Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingBucket.html) 
3.  [What is Amazon CloudFront?](https://aws.amazon.com/cloudfront/) 
4.  [How to Configure CloudFront with S3](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.html)


### **Key Learning Outcomes**:
- Understand the role of S3 for storage and hosting.  
- Learn how a CDN improves performance using CloudFront.  
- Gain practical experience configuring S3 and CloudFront.

---

## **Day 3: Networking and Security**

### **Session 1: Theory**
- Virtual Private Cloud (VPC) concepts: subnets, route tables, and gateways.  
- Securing applications with Security Groups and Network ACLs.  

### **Session 2: Hands-On Lab**
- Create a VPC with public and private subnets.  
- Configure Security Groups for backend API access.  

### **External Resources**: 
1. [What is Amazon VPC?](https://aws.amazon.com/vpc/) 
2.  [VPC Concepts](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html) 
3. [AWS Security Groups Overview](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html) 
4. [Network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html)
5. [VPC Simplified](https://github.com/StartSteps-Digital-Education-GmbH/Course-Navigator/tree/main/Curriculum/06.%20Cloud%20Services%20(AWS)/VPC%20%20Simplified)

### **Key Learning Outcomes**:
- Understand how to create isolated networks using VPC.  
- Learn best practices for securing AWS resources with Security Groups.  
- Gain practical experience in network setup and configuration.

---

## **Day 4: Docker and Containers**

### **Session 1: Theory**
- Introduction to Docker and containerization.  
- Benefits of using containers for application deployment.  
- Overview of **Amazon ECS** and **Fargate**.  

### **Session 2: Hands-On Lab**
- Write Dockerfiles for React, Node.js, and Express.  
- Deploy Dockerized applications to ECS using Fargate.  

### **External Resources**: 
1. [Docker Documentation: Get Started](https://docs.docker.com/get-started/) 
2.  [Writing a Dockerfile](https://docs.docker.com/engine/reference/builder/) 
3.  [Amazon ECS Overview](https://aws.amazon.com/ecs/) 
4. [Amazon Fargate Overview](https://aws.amazon.com/fargate/)

### **Key Learning Outcomes**:
- Understand containerization and Docker's role in modern deployments.  
- Learn how to deploy containerized applications to ECS.  
- Gain practical experience with Docker and ECS.

---

## **Day 5: Load Balancing and Auto Scaling**

### **Session 1: Theory**
- Introduction to **Elastic Load Balancing (ELB)**.  
- Auto Scaling concepts and policies for ECS.  

### **Session 2: Hands-On Lab**
- Configure an Application Load Balancer (ALB) for ECS tasks.  
- Set up Auto Scaling to handle varying traffic loads.  

### **External Resources**: 
1. [Elastic Load Balancing (ELB)](https://aws.amazon.com/elasticloadbalancing/) 
2.  [Configure an Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html) 
3. [Auto Scaling Overview](https://aws.amazon.com/autoscaling/) 
4.  [Scaling ECS Services](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-auto-scaling.html)

### **Key Learning Outcomes**:
- Understand how load balancers distribute traffic.  
- Learn how Auto Scaling ensures application availability.  
- Gain hands-on experience with ALB and scaling policies.

---

## **Day 6: Relational Databases with RDS**

### **Session 1: Theory**
- Overview of Amazon RDS and managed relational databases.  
- PostgreSQL use cases for modern applications.  

### **Session 2: Hands-On Lab**
- Launch and configure an RDS PostgreSQL instance.  
- Connect the backend API to the RDS database.  

### **External Resources**: 
1. [Amazon RDS Overview](https://aws.amazon.com/rds/) 
2.  [Getting Started with Amazon RDS PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PostgreSQL.html) 
3.  [Connecting to an RDS Instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.html)

### **Key Learning Outcomes**:
- Understand managed database services with RDS.  
- Learn best practices for database configuration.  
- Gain hands-on experience connecting RDS with applications.

---

## **Day 7: NoSQL Databases with DynamoDB**

### **Session 1: Theory**
- Introduction to DynamoDB as a NoSQL database.  
- Use cases for DynamoDB in modern applications.  
- Designing tables with partitions, sort keys, and indexes.  

### **Session 2: Hands-On Lab**
- Create DynamoDB tables for the application.  
- Integrate DynamoDB with the backend for query operations.  

### **External Resources**: 
1. [What is Amazon DynamoDB?](https://aws.amazon.com/dynamodb/)
2.  [DynamoDB Table Design Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html) 
3.  [DynamoDB Operations](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithTables.html) 
4. [Using AWS SDKs with DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/UsingSdk.html)

### **Key Learning Outcomes**:
- Understand NoSQL database principles and DynamoDB's strengths.  
- Learn to design and query DynamoDB tables effectively.  
- Gain practical experience integrating DynamoDB with applications.

---

## **Day 8: CI/CD Pipeline Setup**

### **Session 1: Theory**
- Overview of CI/CD and DevOps practices.  
- Introduction to **CodePipeline**, **CodeBuild**, and **CodeDeploy**.  

### **Session 2: Hands-On Lab**
- Set up a CodePipeline to automate builds and ECS deployments.  
- Use CodeBuild for testing Dockerized applications.  

### **External Resources**: 
1. [AWS CodePipeline Overview](https://aws.amazon.com/codepipeline/) 
2.  [Getting Started with CodePipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/getting-started.html) 
3.  [AWS CodeBuild Overview](https://aws.amazon.com/codebuild/) 
4.  [CodeDeploy Deployment Strategies](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-strategies.html)

### **Key Learning Outcomes**:
- Understand the principles of CI/CD workflows.  
- Learn to automate deployments with AWS DevOps tools.  
- Gain hands-on experience with CodePipeline, CodeBuild, and CodeDeploy.

---

## **Day 9: Monitoring and Debugging**

### **Session 1: Theory**
- Introduction to monitoring with **CloudWatch**.  
- Debugging distributed systems with **AWS X-Ray**.  

### **Session 2: Hands-On Lab**
- Set up CloudWatch metrics, logs, and alarms.  
- Enable X-Ray for distributed tracing in the backend.  

### **External Resources**: 
1. [Amazon CloudWatch Overview](https://aws.amazon.com/cloudwatch/) 
2. [Setting Up CloudWatch Dashboards](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html) 
3.  [AWS X-Ray Introduction](https://aws.amazon.com/xray/) 
4.  [Tracing Microservices with AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-ecs.html)

### **Key Learning Outcomes**:
- Understand how to monitor application performance with CloudWatch.  
- Learn how to use X-Ray for debugging distributed systems.  
- Gain hands-on experience setting up monitoring tools.

---

## **Day 10: Security and Capstone Project**

### **Session 1: Theory**
- Managing credentials and secrets with **AWS Secrets Manager**.  
- Review of security best practices in AWS deployments.  

### **Session 2: Hands-On Lab**
- Store database credentials in Secrets Manager.  
- Deploy the full application with integrated AWS services:  
  - **Frontend**: React served via CloudFront.  
  - **Backend**: Node.js/Express on ECS.  
  - **Databases**: RDS PostgreSQL and DynamoDB.  
  - **CI/CD**: Automated pipeline for deployment.  

### **External Resources**: 
1. [AWS Secrets Manager Overview](https://aws.amazon.com/secrets-manager/) 
2.  [Storing Secrets in AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials.html) 
3.  [Best Practices for Securing AWS Applications](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) 
4.  [Deploying Full Applications on AWS](https://docs.aws.amazon.com/whitepapers/latest/serverless-application-lens/aws-serverless-applications-lens.html)

### **Key Learning Outcomes**:
- Understand how to securely store sensitive data using Secrets Manager.  
- Learn best practices for securing AWS applications.  
- Apply all knowledge to deploy a real-world application.

---

## **Overall Course Outcomes**
By the end of this Module, students will:  
1. Understand AWS services and their roles in full-stack application deployment.  
2. Gain hands-on experience with S3, CloudFront, ECS, RDS, DynamoDB, and CI/CD pipelines.  
3. Learn security best practices, monitoring techniques, and cost optimization strategies.  
4. Successfully deploy a Dockerized full-stack application on AWS.
