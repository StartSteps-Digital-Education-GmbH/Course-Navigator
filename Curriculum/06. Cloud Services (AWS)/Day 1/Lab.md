# **Day 1 Lab: AWS Account and IAM Setup**

## **Objective**:
Set up your AWS account and configure IAM users, groups, and roles for secure access.

---

## **Step-by-Step Instructions**

### **Step 1: Create an AWS Account**  
1. Navigate to [AWS Signup Page](https://portal.aws.amazon.com/billing/signup).  
2. Enter your email address, name, and a strong password.  
3. Provide your billing details (AWS requires a credit card).  
4. Verify your identity using a phone number and SMS.  
5. Select the **Free Tier** plan for cost-effective usage.  

**Explanation**:  
This step ensures you have access to AWS services and helps you start with the free tier to minimize costs.

---

### **Step 2: Configure an IAM User**
1. Log in to the AWS Management Console.  
2. Navigate to the **IAM** service.  
3. Click **Users** on the left menu, then click **Add Users**.  
4. Enter a **User Name** (e.g., `AdminUser`).  
5. Select **Programmatic Access** and **AWS Management Console Access**.  
6. Click **Next: Permissions**.  

**Explanation**:  
IAM Users allow secure access to AWS resources and can have customized permissions.

---

### **Step 3: Assign Permissions**  
1. On the permissions page, click **Attach Existing Policies Directly**.  
2. Select the **AdministratorAccess** policy for full access.  
3. Click **Next: Tags** and then **Next: Review**.  
4. Review the user details and click **Create User**.  
5. Download the **Access Key** and **Secret Access Key**.  

**Explanation**:  
The `AdministratorAccess` policy provides all permissions for learning. Access keys are needed for AWS CLI or SDK access.

---

### **Step 4: Test IAM User Access**  
1. Log out of the AWS account.  
2. Log in using the newly created IAM user credentials.  
3. Explore the AWS console to confirm access.  

**Explanation**:  
Testing ensures the IAM user has the correct permissions to use AWS services.

---

## **Key Learning Outcomes**:
1. Understand the purpose of IAM users and roles.  
2. Securely create and manage access to your AWS account.  
3. Configure programmatic and console access for learning purposes.

---

