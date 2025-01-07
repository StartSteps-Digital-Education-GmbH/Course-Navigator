# **Day 3 Lab: Networking and Security**

## **Objective**:
Create a custom VPC, configure public and private subnets, attach an Internet Gateway, set up Route Tables, and define Security Groups to secure resources.

---

## **Step-by-Step Instructions**

### **Step 1: Create a Custom VPC**
1. Navigate to the **VPC** service in the AWS Management Console: [VPC Dashboard](https://console.aws.amazon.com/vpc/).  
2. Click **Create VPC** and select **VPC Only**.  
3. Provide the following details:  
   - **Name Tag**: `MyAppVPC`.  
   - **IPv4 CIDR Block**: `10.0.0.0/16` (this allows 65,536 IP addresses for your network).  
   - **Tenancy**: Default.  
4. Click **Create VPC**.  

**Explanation**:  
A Virtual Private Cloud (VPC) is a private network within AWS that allows you to isolate and manage resources securely. The CIDR block defines the IP range your resources can use.

**Online Resource**:  
- [AWS VPC Documentation](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)

---

### **Step 2: Add Public and Private Subnets**
1. Navigate to **Subnets** under the VPC section.  
2. Click **Create Subnet** and fill in the details for the public subnet:  
   - **Name Tag**: `PublicSubnet`.  
   - **Availability Zone**: Select one (e.g., `us-east-1a`).  
   - **IPv4 CIDR Block**: `10.0.1.0/24` (256 IP addresses).  
3. Repeat the process for the private subnet:  
   - **Name Tag**: `PrivateSubnet`.  
   - **Availability Zone**: Select a different one (e.g., `us-east-1b`).  
   - **IPv4 CIDR Block**: `10.0.2.0/24`.  

**Explanation**:  
Subnets divide your VPC into smaller, manageable sections. Public subnets are for resources requiring internet access, and private subnets are for secure resources like databases.

**Online Resource**:  
- [AWS Subnet Documentation](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html)

---

### **Step 3: Attach an Internet Gateway**
1. Go to **Internet Gateways** and click **Create Internet Gateway**.  
2. Provide a name (e.g., `MyAppIGW`) and click **Create Internet Gateway**.  
3. Select the gateway, click **Actions**, and choose **Attach to VPC**.  
4. Attach the Internet Gateway to your VPC (`MyAppVPC`).  

**Explanation**:  
An Internet Gateway allows resources in public subnets to communicate with the internet.

**Online Resource**:  
- [Internet Gateway Overview](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)

---

### **Step 4: Configure Route Tables**
1. Navigate to **Route Tables** and create two route tables:  
   - **Public Route Table**: Associate with the public subnet and add a route to `0.0.0.0/0` via the Internet Gateway.  
   - **Private Route Table**: Associate with the private subnet and leave without an internet route.  
2. Verify the public subnet now has internet connectivity.  

**Explanation**:  
Route tables define how traffic flows between subnets, VPCs, and the internet.

**Online Resource**:  
- [AWS Route Tables Documentation](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html)

---

### **Step 5: Set Up Security Groups**
1. Navigate to **Security Groups** in the VPC dashboard.  
2. Create a Security Group for the backend API:  
   - **Name**: `BackendSG`.  
   - Allow inbound traffic:  
     - HTTP (port 80) and HTTPS (port 443).  
     - MySQL/Aurora (port 3306).  
   - Allow all outbound traffic.  
3. Attach the Security Group to any backend resources (e.g., ECS tasks or EC2 instances).  

**Explanation**:  
Security Groups act as firewalls to control access to AWS resources. You can customize inbound and outbound rules based on your requirements.

**Online Resource**:  
- [AWS Security Groups Documentation](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)

---

## **Key Learning Outcomes**:
1. Create and configure a custom VPC with public and private subnets.  
2. Attach an Internet Gateway and configure Route Tables for internet access.  
3. Define Security Groups to control access to backend resources.  

---
