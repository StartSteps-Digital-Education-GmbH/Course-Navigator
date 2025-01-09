
### **Step 1: Prerequisites**
Before starting:
1. **AWS Account**: Ensure you have an AWS account ([sign up here](https://aws.amazon.com)).
2. **AWS CLI Installed**: Download and install the AWS CLI on your machine ([setup guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)).
3. **Docker Installed**: Ensure Docker is installed and running locally.
4. **Access Key Configuration**: Run `aws configure` and provide your Access Key, Secret Key, and preferred AWS region.

---

### **Step 2: Launch an AWS EC2 Instance**
1. **Log in to the AWS Management Console**:
   - Go to the [EC2 Dashboard](https://aws.amazon.com/ec2/).
   - Click "Launch Instance."

2. **Configure the Instance**:
   - Choose an Amazon Machine Image (AMI): Select a Linux distribution (e.g., **Ubuntu 20.04**).
   - Instance Type: Select `t2.micro` (free tier eligible).
   - Key Pair: Create or select a key pair for SSH access.
   - Network Settings:
     - Open ports for:
       - **5000** (backend application)
       - **5432** (PostgreSQL database)
       - **22** (SSH access)

3. **Launch the Instance**.

4. **Connect to the Instance**:
   - Run: `ssh -i <your-key-file.pem> ubuntu@<ec2-instance-public-ip>`.

---

### **Step 3: Install Docker on the EC2 Instance**
1. **Update the system packages**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Docker**:
   ```bash
   sudo apt install docker.io -y
   ```

3. **Install Docker Compose**:
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

4. **Check Versions**:
   ```bash
   docker --version
   docker-compose --version
   ```

---

### **Step 4: Copy Your Files to the EC2 Instance**
1. **Copy Your Project Files** (including the `Dockerfile` and `docker-compose.yml`) to the EC2 instance using `scp`:
   ```bash
   scp -i <your-key-file.pem> -r /path-to-your-backend ubuntu@<ec2-instance-public-ip>:~/news_app
   ```

2. **Connect to the EC2 instance again**:
   ```bash
   ssh -i <your-key-file.pem> ubuntu@<ec2-instance-public-ip>
   ```

3. **Navigate to the application directory**:
   ```bash
   cd news_app
   ```

---

### **Step 5: Create and Use `.env.prod`**
Ensure the `news_app` directory contains a file named `.env.prod` with the environment variables for your database and application.

Example:
```env
POSTGRES_USER=news_admin
POSTGRES_PASSWORD=your_password
POSTGRES_DB=news_app_prod
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://news_admin:your_password@postgres:5432/news_app_prod
```

---

### **Step 6: Build and Run the Docker Containers**
1. **Run Docker Compose**:
   ```bash
   sudo docker-compose up --build -d
   ```

2. **Verify the Application**:
   - Use `docker ps` to confirm that the containers (`news_app` and `postgres-db-news-app`) are running.
   - If something isn't working, check logs:
     ```bash
     sudo docker logs news_app
     sudo docker logs postgres-db-news-app
     ```

3. **Access the Backend API**:
   - Your backend should now be available at: `http://<ec2-public-ip>:5000`.

---

### **Step 7: Set Up Data Persistence**
1. **Set Persistent Volumes**:
   Update your `docker-compose.yml` to attach volumes for the database, preventing data loss on container restarts:
   ```yml
   postgres:
     ...
     volumes:
       - postgres_data:/var/lib/postgresql/data
   volumes:
     postgres_data:
   ```

2. Rebuild your containers:
   ```bash
   sudo docker-compose down
   sudo docker-compose up --build -d
   ```

---

### **Step 8: Configure a Production-Ready Deployment**
1. **Enable Application Restart on Boot**:
   ```bash
   sudo systemctl enable docker
   ```

2. **Set up a Reverse Proxy (Optional)**:
   Use **NGINX** or **AWS Load Balancer** to handle routing and add SSL (for HTTPS).

---

### **Step 9: Monitor the Application**
1. **Use Docker Healthchecks**:
   - Confirm health statuses using `docker inspect`.

2. **CloudWatch Logs** (optional):
   - Set up **CloudWatch** to centralize your logs for debugging and monitoring.

---

### **Final Deployment Flow**
Now your backend application should be accessible via the EC2 instance's public IP address, and you can scale or update it as needed.
