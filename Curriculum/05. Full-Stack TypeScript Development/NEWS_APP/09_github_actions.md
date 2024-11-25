### **Guide: Setting Up GitHub Actions for Linting and Testing**

This guide explains **GitHub Actions**, its benefits, and how to set it up for running **ESLint** and **Jest tests** automatically during pull request creation in the **News App** project.

---

### **What is GitHub Actions?**

GitHub Actions is a **CI/CD (Continuous Integration/Continuous Deployment)** tool integrated into GitHub. It allows you to automate workflows, such as running tests, checking code quality, or deploying applications, directly from your GitHub repository.

---

### **Why Use GitHub Actions?**

1. **Automate Code Checks**: Ensure that linting and testing are performed automatically on every pull request.
2. **Prevent Bugs Early**: Catch code quality issues and failed tests before merging.
3. **Improve Collaboration**: Streamline the review process by automating repetitive tasks.
4. **Free for Public Repos**: For public repositories, GitHub Actions is free with generous usage limits.

---

### **Step-by-Step: Setting Up GitHub Actions for the News App**

#### **1. Create a Workflow File**

GitHub Actions workflows are defined in YAML files inside the `.github/workflows/` directory. Let’s set up a workflow for linting and running tests.

Create a file named `.github/workflows/lint-and-test.yml`.

#### **2. Add Workflow Configuration**

Here’s a configuration to run both **ESLint** and **Jest tests**:

```yaml
name: Lint and Test

# Trigger the workflow on pull requests
on:
  pull_request:
    branches:
      - main

jobs:
  lint-and-test:
    name: Lint and Test
    runs-on: ubuntu-latest

    steps:
      # Checkout the code
      - name: Checkout code
        uses: actions/checkout@v3

      # Set up Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      # Install dependencies
      - name: Install dependencies
        run: npm install

      # Run ESLint
      - name: Run ESLint
        run: npm run lint

      # Run Jest tests
      - name: Run Jest tests
        run: npm run test
```

---

#### **3. Explanation of Workflow Steps**

1. **Trigger on Pull Request**:
   The workflow is triggered when a pull request is opened or updated against the `main` branch.

2. **Run on Ubuntu**:
   The workflow uses a Linux environment (`ubuntu-latest`) to run commands.

3. **Steps**:
   - **Checkout code**: Fetches your repository’s code into the runner.
   - **Setup Node.js**: Ensures the correct Node.js version is available.
   - **Install dependencies**: Installs project dependencies from `package.json`.
   - **Run ESLint**: Executes the linter to check for code quality issues.
   - **Run Jest tests**: Runs the test suite to ensure the code behaves as expected.

---

#### **4. Add Badges to README**

Once your workflow is active, you can display its status on your repository’s README file. Add this badge to show the workflow status:
```markdown
![Lint and Test](https://github.com/<your-username>/<your-repo>/actions/workflows/lint-and-test.yml/badge.svg)
```

Replace `<your-username>` and `<your-repo>` with your GitHub username and repository name.

---

### **Best Practices for GitHub Actions**

1. **Fail Early**: Ensure that the workflow stops if ESLint or tests fail.
2. **Parallel Jobs**: Separate linting and testing into parallel jobs to improve performance (if needed).
3. **Caching**: Use caching for `node_modules` to speed up workflows.

Here’s how to enable caching:
```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

---

### **Testing the Workflow**

1. **Push the Workflow File**: Commit and push the `lint-and-test.yml` file to the `main` branch.
2. **Create a Pull Request**: Open a pull request against the `main` branch. The workflow will automatically run.
3. **Review Results**: Check the “Actions” tab in your repository to view the results of the workflow.

---

### **Conclusion**

By integrating GitHub Actions for linting and testing, you ensure that only high-quality and tested code is merged into your project. This guide sets up automated checks for **ESLint** and **Jest**, making your development process more reliable and efficient. In the future, you can extend this workflow to include more checks, such as security audits or deployment tasks.
