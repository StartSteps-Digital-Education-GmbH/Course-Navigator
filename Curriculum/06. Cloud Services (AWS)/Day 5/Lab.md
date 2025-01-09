# **Day 5 Lab: Load Balancing and Auto Scaling**

**Estimated Time**: 1.5 Hours



## **Objective**:
Set up an Application Load Balancer (ALB) to distribute traffic between ECS tasks and configure Auto Scaling for high availability and traffic spikes.

---

## **Step-by-Step Instructions**



### **Step 1: Create an Application Load Balancer**
1. Navigate to the **EC2** dashboard: [EC2 Console](https://console.aws.amazon.com/ec2/).  
2. Under **Load Balancing**, click **Load Balancers** and select **Create Load Balancer**.  
3. Choose **Application Load Balancer (ALB)**.  
4. Configure the load balancer:  
 - **Name**: `MyAppALB`.  
 - **Scheme**: Internet-facing.  
 - **Listeners**: Add HTTP (Port 80).  
 - **Availability Zones**: Select two or more zones and associate public subnets.  
5. Click **Create Load Balancer**.  

**Explanation**:  
The ALB distributes incoming traffic across multiple ECS tasks or instances to improve availability and reliability.

**Online Resource**:  
- [Creating an Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-application-load-balancer.html)

---

### **Step 2: Create a Target Group**
1. Under **Load Balancing**, click **Target Groups** and select **Create Target Group**.  
2. Choose **Target Type**: `IP` for ECS tasks.  
3. Configure the target group:  
 - **Name**: `MyAppTargetGroup`.  
 - **Protocol**: HTTP.  
 - **Health Check Path**: `/` for the frontend.  
4. Click **Create Target Group**.  

**Explanation**:  
A target group specifies where ALB routes incoming traffic, such as ECS tasks or EC2 instances.

**Online Resource**:  
- [Creating Target Groups](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-target-group.html)

---

### **Step 3: Attach ALB to ECS Services**
1. Navigate to the **ECS** dashboard: [ECS Console](https://console.aws.amazon.com/ecs/).  
2. Select your **frontend service** and edit the service settings.  
3. In the **Load Balancer** section:  
 - Choose the ALB created earlier.  
 - Select the target group for the frontend.  
4. Save and redeploy the service.  

**Explanation**:  
Attaching the ALB ensures ECS tasks automatically register with the target group.

**Online Resource**:  
- [Using ALB with ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-load-balancing.html)

---

### **Step 4: Configure Auto Scaling**
1. In the **ECS Services** tab, click the service name.  
2. Select the **Auto Scaling** tab and click **Create Auto Scaling Policy**.  
3. Configure scaling policies:  
 - **Metric Type**: CPUUtilization.  
 - **Threshold**: Scale up if CPU > 70% and scale down if CPU < 30%.  
 - **Min/Max Tasks**: Set a minimum of 1 task and a maximum of 5 tasks.  

**Explanation**:  
Auto Scaling adjusts the number of running ECS tasks based on workload metrics.

**Online Resource**:  
- [ECS Service Auto Scaling](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-auto-scaling.html)

---

## **Potential Permission Requirements**

### **IAM User Permissions for ALB** 
To create and manage ALBs and target groups, ensure the user or role has the following policies:  
- **`ElasticLoadBalancingFullAccess`**  

#### **Steps to Verify Permissions** 
1. Check the attached policies for the IAM user or role:  
   [Viewing IAM Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage.html)  
2. If using a custom policy, include actions like:  
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "elasticloadbalancing:CreateLoadBalancer",
           "elasticloadbalancing:CreateTargetGroup",
           "elasticloadbalancing:RegisterTargets"
         ],
         "Resource": "*"
       }
     ]
   }`` 

### **IAM User Permissions for ECS Auto Scaling**

To configure Auto Scaling, attach the following policy:

-   **`ApplicationAutoScalingFullAccess`**

#### **Steps to Verify Permissions**

1.  Confirm the policy is attached to the IAM user or role.  
    [Auto Scaling Policy Documentation](https://docs.aws.amazon.com/autoscaling/application/userguide/what-is-application-auto-scaling.html)

----------

## **Key Learning Outcomes**:

1.  Set up an ALB to distribute traffic across ECS tasks.
2.  Configure Auto Scaling for ECS services to handle workload spikes.
3.  Manage permissions for ALB and Auto Scaling effectively.
