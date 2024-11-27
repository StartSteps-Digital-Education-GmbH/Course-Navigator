### **Guide: Setting Up GitHub Actions for Linting, Testing, and Docker Build**

This guide details how to configure **GitHub Actions** to automate **ESLint**, **Jest tests**, and verify Docker builds in the **News App** backend repository.

---

### **Why Use GitHub Actions?**

1. **Automated CI/CD**: Run linting, testing, and Docker build validations on every pull request.
2. **Catch Errors Early**: Avoid merging untested or poorly formatted code.
3. **Streamlined Collaboration**: Ensure code quality checks before merging.
4. **Free for Public Repos**: Generous usage limits for public repositories.

---

### **Step-by-Step Guide**

#### **1. Create a Workflow File**

Create a file named `.github/workflows/backend-ci.yml` in your repository.

#### **2. Add Workflow Configuration**

Here’s the YAML configuration for linting, testing, and Docker build validation:

```yaml
name: Backend CI Pipeline

# Trigger workflow on pull requests
on:
  pull_request:
    branches:
      - main

jobs:
  lint-and-test:
    name: Lint and Test
    runs-on: ubuntu-latest

    steps:
      # Step 1: Checkout the repository
      - name: Checkout repository
        uses: actions/checkout@v3

      # Step 2: Set up Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      # Step 3: Cache dependencies
      - name: Cache Node.js modules
        uses: actions/cache@v3
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      # Step 4: Install dependencies
      - name: Install dependencies
        run: npm install

      # Step 5: Run ESLint
      - name: Run ESLint
        run: npm run lint

      # Step 6: Run Jest tests
      - name: Run Jest tests
        env:
          NODE_ENV: test
        run: npm run test

  docker-build:
    name: Docker Build Validation
    runs-on: ubuntu-latest

    steps:
      # Step 1: Checkout repository
      - name: Checkout repository
        uses: actions/checkout@v3

      # Step 2: Set up Docker
      - name: Log in to DockerHub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      # Step 3: Build Docker image
      - name: Build Docker Image
        run: docker build -t news-app-backend .

      # Step 4: Run Docker container
      - name: Run Container for Validation
        run: docker run --rm -d -p 8080:8080 news-app-backend
```

---

### **Workflow Explanation**

#### **Lint and Test Job**
1. **Install Node.js**: Ensures your app uses Node.js version 18.
2. **Cache Dependencies**: Speeds up installs by caching `node_modules`.
3. **Run ESLint**: Lints the code using your ESLint configuration.
4. **Run Jest Tests**: Executes tests using the Jest configuration.

#### **Docker Build Job**
1. **DockerHub Login**: Logs into DockerHub using secrets for `DOCKER_USERNAME` and `DOCKER_PASSWORD`.
2. **Build Docker Image**: Builds the Docker image from your `Dockerfile`.
3. **Run Container**: Runs the Docker container to ensure the image works correctly.

---

### **Setting Secrets for DockerHub**

1. Go to your repository’s **Settings > Secrets and Variables > Actions**.
2. Add the following secrets:
   - `DOCKER_USERNAME`: Your DockerHub username.
   - `DOCKER_PASSWORD`: Your DockerHub password.

---

### **Add Workflow Badges to README**

Add the following badges to your `README.md` to display the status of your workflow:

```markdown
![Lint and Test](https://github.com/<your-username>/<your-repo>/actions/workflows/backend-ci.yml/badge.svg)
![Docker Build](https://github.com/<your-username>/<your-repo>/actions/workflows/backend-ci.yml/badge.svg)
```

Replace `<your-username>` and `<your-repo>` with your GitHub username and repository name.

---

### **Best Practices**

1. **Fail Fast**: Use `fail-fast: true` in jobs to terminate subsequent steps if one fails.
2. **Parallelization**: Run linting, testing, and Docker validation as separate jobs to optimize execution time.
3. **Testing with Docker**: Enhance your Docker validation by running your Jest tests inside the container.

Here’s an example step to run Jest inside Docker:
```yaml
- name: Test Inside Docker
  run: |
    docker build -t news-app-backend .
    docker run --rm -e NODE_ENV=test news-app-backend npm run test
```

---

### **Testing the Workflow**

1. **Push Workflow File**: Commit and push `.github/workflows/backend-ci.yml` to `main`.
2. **Create a Pull Request**: Open a pull request to `main`. The workflow will run automatically.
3. **Review Results**: Visit the “Actions” tab to monitor the results.

---

### **Conclusion**

This setup ensures your **News App** backend repository automatically validates code quality, passes tests, and verifies Docker builds. Adopting this pipeline enhances reliability, simplifies collaboration, and accelerates CI/CD workflows.
