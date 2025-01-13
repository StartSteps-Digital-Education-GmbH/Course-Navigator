# **AWS Deployment Prerequisites Guide**

This guide outlines all the necessary preparations for deploying applications using AWS Elastic Beanstalk with Docker. It includes setting up your AWS account, installing required software, configuring environments, and addressing specific requirements for new AWS accounts.

---

## **Step 1: Installing Required Software**

### **1.1 AWS Command Line Interface (CLI)**
- **Install AWS CLI**:
  Follow the [AWS CLI Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).

- **Verify Installation**:
  ```bash
  aws --version
  ```
  The output should display the installed version of the AWS CLI.

### **1.2 Elastic Beanstalk Command Line Interface (EB CLI)**
- **Install EB CLI**:
  Refer to the [Elastic Beanstalk CLI Setup Guide](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html).

- **Verify Installation**:
  ```bash
  eb --version
  ```
  Ensure the version is correctly displayed.

### **1.3 Docker**
- Install Docker from the [Docker Website](https://www.docker.com/products/docker-desktop/).
- Verify Docker is running by executing:
  ```bash
  docker --version
  ```

---

## **Step 2: Configuring AWS Account**

### **2.1 Check Default VPC**
Elastic Beanstalk requires a VPC. New AWS accounts may not have a default VPC created.

- **Check if Default VPC Exists (Graphical Console)**:
  1. Navigate to the [VPC Dashboard](https://console.aws.amazon.com/vpc/home).
  2. Look for a VPC labeled "default".

- **Check via AWS CLI**:
  ```bash
  aws ec2 describe-vpcs --filters Name=isDefault,Values=true
  ```
  If no default VPC exists, you will need to create one.

### **2.2 Create Default VPC (if needed)**
- **Graphical Console**:
  1. In the [VPC Dashboard](https://console.aws.amazon.com/vpc/home), click **Actions** > **Create Default VPC**.
  2. Follow the prompts and confirm.

- **AWS CLI**:
  ```bash
  aws ec2 create-default-vpc
  ```
  Once created, verify using:
  ```bash
  aws ec2 describe-vpcs --filters Name=isDefault,Values=true
  ```

---

## **Step 3: Setting Up IAM Roles and Policies**

### **3.1 Elastic Beanstalk Instance Profile**
Elastic Beanstalk environments require an instance profile to manage AWS resources.

- **Graphical Console**:
  1. Navigate to the [IAM Dashboard](https://console.aws.amazon.com/iam/home).
  2. Select **Roles** > **Create Role**.
  3. Choose **AWS Service** > **Elastic Beanstalk** > **Elastic Beanstalk EC2 Role**.
  4. Assign a name (e.g., `aws-elasticbeanstalk-ec2-role`) and save.
  5. Navigate to **Instance Profiles** and attach the newly created role.

- **AWS CLI**:
  ```bash
  aws iam create-role --role-name aws-elasticbeanstalk-ec2-role --assume-role-policy-document file://trust-policy.json
  ```
  Replace `trust-policy.json` with a policy document granting Elastic Beanstalk access to AWS services. Then, attach the necessary policies:
  ```bash
  aws iam attach-role-policy --role-name aws-elasticbeanstalk-ec2-role --policy-arn arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier
  aws iam attach-role-policy --role-name aws-elasticbeanstalk-ec2-role --policy-arn arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker
  ```
  Attach the role to an instance profile:
  ```bash
  aws iam create-instance-profile --instance-profile-name aws-elasticbeanstalk-instance-profile
  aws iam add-role-to-instance-profile --instance-profile-name aws-elasticbeanstalk-instance-profile --role-name aws-elasticbeanstalk-ec2-role
  ```

### **3.2 Key Pair Creation**
Key pairs are required for SSH access to EC2 instances.

- **Graphical Console**:
  1. Go to the [EC2 Dashboard](https://console.aws.amazon.com/ec2/home).
  2. Under "Network & Security," select **Key Pairs**.
  3. Click **Create Key Pair**, enter a name (e.g., `news-app-key-pair`), and download the `.pem` file.

- **AWS CLI**:
  ```bash
  aws ec2 create-key-pair --key-name news-app-key-pair --query 'KeyMaterial' --output text > news-app-key-pair.pem
  ```
  Secure the key with:
  ```bash
  chmod 400 news-app-key-pair.pem
  ```

---

## **Step 4: Configuring Security Groups**

### **4.1 Ensure Required Ports Are Open**
- **Graphical Console**:
  1. Navigate to the [Security Groups section](https://console.aws.amazon.com/ec2/home).
  2. Select or create a security group for the application.
  3. Add inbound rules for:
     - HTTP (Port 80)
     - HTTPS (Port 443)
     - Custom Port (e.g., 5000 if your app uses it).

- **AWS CLI**:
  ```bash
  aws ec2 authorize-security-group-ingress --group-id <security-group-id> --protocol tcp --port 80 --cidr 0.0.0.0/0
  aws ec2 authorize-security-group-ingress --group-id <security-group-id> --protocol tcp --port 443 --cidr 0.0.0.0/0
  aws ec2 authorize-security-group-ingress --group-id <security-group-id> --protocol tcp --port 5000 --cidr 0.0.0.0/0
  ```
  Replace `<security-group-id>` with your group ID.

---

## **Step 5: Final Checks**

### **5.1 Verify All Configurations**
- Check VPCs:
  ```bash
  aws ec2 describe-vpcs
  ```
- Check Security Groups:
  ```bash
  aws ec2 describe-security-groups
  ```
- Check IAM Roles:
  ```bash
  aws iam list-roles
  ```
- Ensure Instance Profile is Set:
  ```bash
  aws iam get-instance-profile --instance-profile-name aws-elasticbeanstalk-instance-profile
  ```

With these steps, your AWS account should be ready to deploy applications using Elastic Beanstalk. Ensure all commands are executed in the same AWS region as your Elastic Beanstalk environment.

