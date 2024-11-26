### **Guide: Best Practices for Contributing to a Forked Repository**

This guide explains how students can contribute to the main repository for the [News-App](https://github.com/StartSteps-Digital-Education-GmbH/News-App) project while working on their own forks and branches. It ensures smooth collaboration and adheres to best practices for Git and GitHub workflows.

---

### **1. Fork the Repository**
1. Go to the [News-App repository](https://github.com/StartSteps-Digital-Education-GmbH/News-App).
2. Click on the **Fork** button in the top-right corner.
3. This will create a copy of the repository under your own GitHub account.

---

### **2. Clone Your Fork**
1. Copy the SSH/HTTPS URL of your forked repository.
2. Clone your forked repository to your local machine:
   ```bash
   git clone <your-forked-repo-url>
   ```
3. Navigate into the project directory:
   ```bash
   cd News-App
   ```

---

### **3. Add the Original Repository as a Remote**
To keep your fork up-to-date with the main repository:
```bash
git remote add upstream https://github.com/StartSteps-Digital-Education-GmbH/News-App
```
- `origin`: Your fork (default remote).
- `upstream`: The original repository.

You can check your remotes using:
```bash
git remote -v
```

---

### **4. Create and Work on Your Own Branch**
1. Pull the latest changes from the `main` branch of the original repository:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```
2. Create a new branch for your daily work:
   ```bash
   git checkout -b <your-daily-branch-name>
   ```
3. Work on your daily code here, and commit your changes:
   ```bash
   git add .
   git commit -m "Your commit message"
   ```
4. Push your branch to your forked repository:
   ```bash
   git push origin <your-daily-branch-name>
   ```

---

### **5. Syncing Your Fork with the Original Repository**
Before contributing, ensure your fork is in sync with the latest changes from the main repository.

1. Fetch the latest changes from the upstream repository:
   ```bash
   git fetch upstream
   ```
2. Merge the changes into your local `main` branch:
   ```bash
   git checkout main
   git merge upstream/main
   ```
3. Push the updated `main` branch to your fork:
   ```bash
   git push origin main
   ```

---

### **6. Contributing Changes to the Main Repository**
When you wish to contribute, follow these steps:

#### Step 1: Create a New Branch from the Tracked Branch
1. Create a new branch from the branch you’re tracking (e.g., `main`):
   ```bash
   git checkout main
   git checkout -b <feature-branch-name>
   ```

#### Step 2: Make Changes and Commit
1. Make your changes.
2. Stage and commit them:
   ```bash
   git add .
   git commit -m "Add detailed commit message"
   ```
3. Push your branch to your fork:
   ```bash
   git push origin <feature-branch-name>
   ```

#### Step 3: Open a Pull Request (PR)
1. Go to your forked repository on GitHub.
2. Navigate to your new branch and click **Compare & Pull Request**.
3. In the PR, ensure the base repository is:
   ```
   base repository: StartSteps-Digital-Education-GmbH/News-App
   base branch: <branch-you-are-contributing-to>
   ```
   And the head repository is:
   ```
   head repository: <your-github-username>/News-App
   compare: <feature-branch-name>
   ```
4. Provide a detailed description of your changes and click **Create Pull Request**.

---

### **7. Reviewing and Merging PRs**
As a class, the PR will be reviewed together:
1. Check for conflicts and code quality.
2. Once approved, the PR can be merged into the base branch.

---

### **8. Best Practices for Contributions**
1. **Commit Messages**: Write clear and descriptive commit messages. Use the imperative tone (e.g., "Add feature X").
2. **Branch Naming**:
   - Use meaningful names (e.g., `feature/authentication` or `fix/typo-in-readme`).
   - Avoid spaces or special characters.
3. **Keep Pull Requests Small**: Focus on a single feature or fix per PR.
4. **Stay Updated**: Always pull the latest changes from `upstream` before creating a PR.
5. **Collaborate**: Use comments on GitHub to discuss and review changes.

---

### **9. Example Workflow**
#### Scenario: You want to fix a bug in the `main` branch.
1. **Sync your fork**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   git push origin main
   ```
2. **Create a feature branch**:
   ```bash
   git checkout -b fix/login-bug
   ```
3. **Make changes, commit, and push**:
   ```bash
   git add .
   git commit -m "Fix login bug where invalid token caused crash"
   git push origin fix/login-bug
   ```
4. **Open a PR**: Compare your `fix/login-bug` branch to the `main` branch of the original repository.

---

### **10. Additional Commands**
- Check your current branch:
  ```bash
  git branch
  ```
- Switch branches:
  ```bash
  git checkout <branch-name>
  ```
- Delete a branch locally (after merging):
  ```bash
  git branch -d <branch-name>
  ```

---

### **Conclusion**
By following this guide, students can work on their own projects while contributing to the main repository seamlessly. This process ensures proper version control, avoids conflicts, and promotes a collaborative learning environment.
