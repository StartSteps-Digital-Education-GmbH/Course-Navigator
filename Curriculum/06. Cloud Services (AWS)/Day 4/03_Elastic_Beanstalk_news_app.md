## **Deploying with AWS Elastic Beanstalk Using Docker**

---

### **Step 1: Prerequisites**

Ensure you have:

1. **AWS Account**: Make sure you have an active AWS account. Set up billing alerts via the [AWS Cost Management Dashboard](https://aws.amazon.com/aws-cost-management/).

2. **AWS CLI Installed**: Follow the [AWS CLI Installation guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).

3. **Elastic Beanstalk CLI Installed**: Install the EB CLI as per the [Elastic Beanstalk CLI Setup guide](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html).

4. **Docker Installed**: Ensure Docker is installed and running on your machine.

5. **Dockerfile Configured**: Your `Dockerfile` should resemble the following:

   ```dockerfile
   FROM node:16

   WORKDIR /app

   COPY package*.json ./
   RUN npm install

   COPY . .

   RUN npm run build

   CMD ["npm", "start"]
   ```

6. **Access Key Configuration**: Set up AWS CLI credentials via:
   ```bash
   aws configure
   ```

7. **Basic Understanding of Elastic Beanstalk and RDS**:
   Elastic Beanstalk is a platform for deploying web applications, and RDS is a managed database service. Both simplify app hosting and database management.

---

### **Step 2: Set Up PostgreSQL with RDS**

Use AWS RDS for a managed and persistent PostgreSQL database.

1. **Create an RDS PostgreSQL Instance**:
   - Navigate to the [AWS RDS Console](https://aws.amazon.com/rds/).
   - Click **Create database**.
   - Configure the following:
     - **Engine**: PostgreSQL
     - **Template**: Free Tier
     - **Instance Identifier**: `news-app-db`
     - **Master Username**: `news_admin`
     - **Password**: Use a secure password.
     - **Storage**: 20 GiB (sufficient for testing).
   - Allow public access temporarily (for development).

2. **Retrieve the RDS Endpoint**:
   - After creation, copy the **Endpoint URL** (e.g., `news-app-db.xxxxxxx.region.rds.amazonaws.com`).

3. **Update Environment Variables**:
   - Create a `.env.prod` file in your project directory:

     ```env
     POSTGRES_USER=news_admin
     POSTGRES_PASSWORD=your_password
     POSTGRES_DB=news_app_prod
     DATABASE_URL=postgresql://news_admin:your_password@news-app-db.xxxxxxx.region.rds.amazonaws.com:5432/news_app_prod
     NODE_ENV=production
     PORT=5000
     ```

   **Note**: For production, ensure RDS access is restricted using security groups.

---

### **Step 3: Configure the Project for Elastic Beanstalk**

1. **Create a `.ebextensions` Folder**:
   - Create a folder named `.ebextensions` in the project root.
   - Inside `.ebextensions`, create a file named `docker.config`:

     ```yaml
     option_settings:
       aws:elasticbeanstalk:application:environment:
         NODE_ENV: production
         PORT: 5000
         DATABASE_URL: postgresql://news_admin:your_password@news-app-db.xxxxxxx.region.rds.amazonaws.com:5432/news_app_prod
     ```

   This file defines environment variables for your Elastic Beanstalk application.

2. **Initialize Elastic Beanstalk**:
   - Open a terminal in the project directory and run:
     ```bash
     eb init
     ```
   - Follow the prompts:
     - Select your AWS region.
     - Enter an application name (e.g., `news-app`).
     - Choose **Docker** as the platform.

3. **Ignore Unnecessary Files**:
   - Add a `.ebignore` file to exclude unwanted files from deployment:
     ```plaintext
     node_modules
     .env*
     docker-compose.yml
     .git
     .DS_Store
     ```

---

### **Step 4: Deploy the App with Elastic Beanstalk**

1. **Create a Dockerrun File**:
   - Add a `Dockerrun.aws.json` file to your project root:
     ```json
     {
       "AWSEBDockerrunVersion": "1",
       "Image": {
         "Name": "node:16",
         "Update": "true"
       },
       "Ports": [
         {
           "ContainerPort": 5000
         }
       ]
     }
     ```

2. **Create the Elastic Beanstalk Environment**:
   - Run the following command:
     ```bash
     eb create news-app-env
     ```
   - The environment creation process might take several minutes.

3. **Monitor Deployment**:
   - Check environment status:
     ```bash
     eb status
     ```
   - View logs for debugging:
     ```bash
     eb logs
     ```

4. **Verify the Deployment**:
   - Visit the Elastic Beanstalk environment’s public URL (e.g., `http://news-app-env.region.elasticbeanstalk.com`).

---

### **Step 5: Scaling and Monitoring**

1. **Configure Autoscaling**:
   - In the Elastic Beanstalk console, under "Configuration," adjust autoscaling settings for instance counts.

2. **Set Up HTTPS (Optional)**:
   - Attach an AWS Load Balancer with SSL certificates.
   - Use AWS Certificate Manager to request free certificates.

3. **Monitor Performance**:
   - Access the Elastic Beanstalk **Monitoring** tab.
   - Use AWS CloudWatch for deeper insights and alarms.

---

### **Step 6: Updating Your App**

1. Make your code changes.
2. Redeploy using:
   ```bash
   eb deploy
   ```

---

### **Step 7: Cost Management and Cleanup**

1. **Monitor Costs**:
   - Use the [AWS Cost Management Dashboard](https://aws.amazon.com/aws-cost-management/).

2. **Cleanup Resources**:
   - Terminate the Elastic Beanstalk environment:
     ```bash
     eb terminate news-app-env
     ```
   - Delete the RDS instance (if not needed):
     ```bash
     aws rds delete-db-instance --db-instance-identifier news-app-db --skip-final-snapshot
     ```

---

### **Common Troubleshooting Tips**

- **Docker Image Pull Errors**: Ensure the internet connection is stable.
- **RDS Connection Refused**: Verify the RDS endpoint, username, and password.
- **Application Port Mismatch**: Ensure `PORT=5000` is consistent in `.env`, `Dockerfile`, and `.ebextensions`.
- **Health Check Failures**: Modify the Elastic Beanstalk health check path if your app does not respond on `/`.

---

### **Why This Setup Works**

1. **RDS for External Database**: Keeps the database independent and managed.
2. **Elastic Beanstalk Deployment**: Simplifies hosting and scaling with Docker.
3. **Scalability and Monitoring**: Built-in autoscaling and robust monitoring with AWS tools.
4. **Security Awareness**: Highlights best practices like restricting database access and monitoring costs.

With this setup, you’ll have a solid foundation for deploying Dockerized applications on AWS Elastic Beanstalk!

