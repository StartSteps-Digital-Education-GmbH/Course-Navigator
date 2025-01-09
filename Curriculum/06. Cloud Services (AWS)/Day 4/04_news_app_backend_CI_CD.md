## **Step-by-Step Guide to Add Elastic Beanstalk CI/CD in GitHub Actions**

---

### **1. Prerequisites**
Before proceeding:
1. You’ve already deployed the Elastic Beanstalk environment as outlined in the previous guides.
2. The Elastic Beanstalk CLI (`eb`) is installed on your local machine.
3. Your app uses Docker and a `Dockerrun.aws.json` for Elastic Beanstalk.

---

### **2. Configure AWS Credentials in GitHub Actions**
1. Go to your GitHub repository's **Settings** → **Secrets and Variables** → **Actions**.
2. Add the following secrets:
   - `AWS_ACCESS_KEY_ID`: Your AWS IAM access key.
   - `AWS_SECRET_ACCESS_KEY`: Your AWS IAM secret key.
   - `AWS_REGION`: The AWS region (e.g., `us-east-1`).

> Use an IAM user with permissions for Elastic Beanstalk and S3. The IAM policy should include:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "elasticbeanstalk:*",
        "s3:*",
        "cloudwatch:*",
        "ec2:*",
        "iam:PassRole"
      ],
      "Resource": "*"
    }
  ]
}
```

---

### **3. Update Your GitHub Actions Workflow**
Here’s an enhanced workflow that integrates **Elastic Beanstalk deployment**.

#### **Complete CI/CD Workflow**
```yaml
name: CI/CD Workflow

on:
  pull_request:
    branches:
      - main
  push:
    branches:
      - main

jobs:
  lint-and-test:
    name: Lint and Test
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        ports:
          - 5432:5432
        env:
          POSTGRES_USER: ${{ secrets.POSTGRES_USER || 'news_admin' }}
          POSTGRES_PASSWORD: ${{ secrets.POSTGRES_PASSWORD || 'news_admin' }}
          POSTGRES_DB: ${{ secrets.POSTGRES_DB || 'news_app_test' }}
        options: >-
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5
          --health-cmd="pg_isready -U $POSTGRES_USER -d $POSTGRES_DB"

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set Up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install Dependencies
        run: npm install

      - name: Run ESLint
        run: npm run lint

      - name: Run Jest Tests
        env:
          POSTGRES_HOST: localhost
          POSTGRES_PORT: 5432
          POSTGRES_USER: ${{ secrets.POSTGRES_USER || 'news_admin' }}
          POSTGRES_PASSWORD: ${{ secrets.POSTGRES_PASSWORD || 'news_admin' }}
          POSTGRES_DB: ${{ secrets.POSTGRES_DB || 'news_app_test' }}
        run: npm test

  deploy:
    name: Deploy to Elastic Beanstalk
    runs-on: ubuntu-latest
    needs: lint-and-test  # Runs only if lint-and-test passes

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Install AWS CLI
        run: |
          curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
          unzip awscliv2.zip
          sudo ./aws/install

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v3
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Package Application
        run: |
          zip -r app.zip . -x .git/* node_modules/*

      - name: Upload to S3 (Optional)
        run: |
          aws s3 cp app.zip s3://your-app-bucket-name/

      - name: Deploy to Elastic Beanstalk
        run: |
          eb init -p docker ${{ secrets.APP_NAME }} --region ${{ secrets.AWS_REGION }}
          eb deploy ${{ secrets.EB_ENV_NAME }}
```

---

### **4. How the Workflow Works**
1. **Build and Test (lint-and-test job)**:
   - Runs ESLint and Jest tests using your existing workflow.
   - Skips deployment if any step fails.

2. **AWS Deployment (deploy job)**:
   - Packages your application into a `.zip` file.
   - Uploads it to AWS Elastic Beanstalk, deploying it directly to your environment.

3. **Using AWS Secrets**:
   - The `aws-actions/configure-aws-credentials` GitHub Action integrates AWS securely into the pipeline.

---

### **5. Optional Steps for Optimization**

1. **Use GitHub Environments**:
   - Configure `production` or `staging` deployment environments with manual approval steps to prevent direct production deployment.

2. **Improve Logs**:
   - Add additional logging to monitor Elastic Beanstalk deployment:
     ```yaml
     - name: Monitor Deployment
       run: |
         eb health
     ```

3. **Notification Integration**:
   - Add Slack or email notifications for workflow success/failure.

---

### **6. Verifying Deployment**
After deployment, verify:
1. Elastic Beanstalk Console: Check the health and logs of your application.
2. Application URL: Visit the Beanstalk endpoint and confirm the app is running as expected.

---

### **7. Benefits of CI/CD with GitHub Actions**
1. **Automated Testing and Deployment**: Ensures the application is error-free before production deployment.
2. **Seamless Integration with AWS**: GitHub Actions provide a secure and easy way to interact with Elastic Beanstalk.
3. **Scalability and Flexibility**: Easily extend workflows for staging, QA, or load testing environments.
