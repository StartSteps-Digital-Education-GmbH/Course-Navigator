
# **Day 6 Lab: Relational Databases with RDS** 
**Estimated Time**: 1.5 Hours  



## **Objective**:
Set up an Amazon RDS PostgreSQL database, connect it to your backend API, and implement database performance monitoring.

--- 
## **Step-by-Step Instructions**


### **Step 1: Create an RDS PostgreSQL Instance**
1. Navigate to the **RDS** service: [RDS Console](https://console.aws.amazon.com/rds/).  
2. Click **Create Database** and choose:  
   - **Engine Type**: PostgreSQL.  
   - **Template**: Free Tier.  
3. Configure database settings:  
   - **DB Instance Identifier**: `MyAppDB`.  
   - **Master Username**: `admin`.  
   - **Master Password**: Set a secure password.  
4. Select a **DB Instance Class** (e.g., `db.t3.micro`) and allocate 20 GB storage.  
5. Choose a VPC and select the private subnet group.  
6. Click **Create Database**.  

**Explanation**:  
Amazon RDS is a managed database service that automates tasks like backups and scaling.

**Online Resource**:  
- [Creating an RDS Instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_CreateDBInstance.html)

--- 
### **Step 2: Configure Security Groups**
1. Navigate to **EC2 Security Groups**: [Security Groups Console](https://console.aws.amazon.com/ec2/v2/home#SecurityGroups).  
2. Add an inbound rule to the RDS Security Group:  
   - **Type**: PostgreSQL.  
   - **Port Range**: 5432.  
   - **Source**: Security Group of the ECS tasks.  

**Explanation**:  
This ensures only backend ECS tasks can access the RDS instance.

**Online Resource**:  
- [RDS Security Group Configuration](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.RDSSecurityGroups.html)

--- 
### **Step 3: Connect Backend API to RDS**
1. Retrieve the **RDS Endpoint** from the RDS dashboard.  
2. Update the backend application’s `.env` file with:  
   ```env
   DB_HOST=<RDS-endpoint>
   DB_USER=admin
   DB_PASSWORD=<password>
   DB_NAME=<database_name>`` 

3.  Redeploy the backend service in ECS.

**Explanation**:  
The `.env` file stores database credentials for secure connection.

**Online Resource**:

-   [Connecting Applications to RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.html)

----------

### **Step 4: Enable RDS Monitoring**

1.  In the RDS console, select your instance and go to the **Monitoring** tab.
2.  Enable Enhanced Monitoring to view performance metrics.
3.  Configure alarms in **CloudWatch** for high CPU or memory usage.

**Explanation**:  
Enhanced Monitoring provides real-time metrics for database performance.

**Online Resource**:

-   [RDS Monitoring Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/MonitoringOverview.html)

----------

## **Potential Permission Requirements**

### **IAM User Permissions for RDS**

To create and manage RDS databases, ensure the user has the following policy:

-   **`AmazonRDSFullAccess`**

#### **Steps to Verify Permissions**

1.  View attached policies in the IAM console:  
    [Viewing IAM Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage.html)
2.  If creating a custom policy, include:
    
   ```json 
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [
            "rds:CreateDBInstance",
            "rds:ModifyDBInstance",
            "rds:DeleteDBInstance",
            "rds:DescribeDBInstances"
          ],
          "Resource": "*"
        }
      ]
    }
   ``` 

----------

## **Key Learning Outcomes**:

1.  Set up and configure an Amazon RDS PostgreSQL database.
2.  Secure the database using Security Groups.
3.  Monitor database performance using RDS Enhanced Monitoring.
