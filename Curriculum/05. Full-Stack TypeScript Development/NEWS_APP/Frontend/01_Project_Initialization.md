# Guide: Creating a React Project with TypeScript

## Introduction
This guide walks you through setting up a React project with TypeScript. By the end of this guide, you'll have a functioning React project ready for development and integration with your backend. We will ensure the project is structured for scalability and future enhancements.

---

## Prerequisites
Before starting, make sure you have the following:
- **Node.js** installed (v16 or higher is recommended).
- **npm** or **yarn** for package management.
- A code editor (e.g., Visual Studio Code).
- Basic knowledge of React and TypeScript.

---

## Step 1: Initialize the Project
We’ll use `Vite` for this project due to its fast build times and ease of use.

### Command:
```bash
npm create vite@latest my-news-app --template react-ts
```
### Steps:
1. **Run the command** and provide the project name (e.g., `my-news-app`).
2. **Select the template**: `react-ts` for React + TypeScript.
3. **Navigate to the project folder**:
   ```bash
   cd my-news-app
   ```

---

## Step 2: Install Dependencies
### Install Base Dependencies:
```bash
npm install
```
This installs the dependencies defined in `package.json`.

### Add Useful Developer Tools:
```bash
npm install --save-dev @types/node @vitejs/plugin-react
```
These packages include type definitions and plugins for enhanced TypeScript support.

---

## Step 3: Configure TypeScript
Vite provides a `tsconfig.json` file. Update it for improved development experience:

### Example `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```
This ensures compatibility with modern JavaScript while enforcing type safety.

---

## Step 4: Run the Development Server
### Command:
```bash
npm run dev
```
### Steps:
1. Open the browser and navigate to the provided local server link (e.g., `http://localhost:5173`).
2. Verify the default template is working.

---

## Step 5: Clean the Project Structure
To align the project with our backend integration:

1. Delete unnecessary files (e.g., `App.css`, `vite.svg`).
2. Update `App.tsx` to include a placeholder component.

### Example `App.tsx`:
```tsx
function App() {
  return (
    <div className="App">
      <h1>Welcome to My News App</h1>
    </div>
  );
}

export default App;
```

---

## Step 6: Setup Version Control
### Initialize Git:
```bash
git init
git add .
git commit -m "Initial project setup"
```
### Create a GitHub Repository:
1. Go to GitHub and create a new repository.
2. Add the remote origin:
   ```bash
   git remote add origin <repository-url>
   git branch -M main
   git push -u origin main
   ```

---

## Summary
You have successfully set up a React project with TypeScript! This project is now ready for further enhancements like adding linters, Docker, and routes.

---

## Next Steps
Proceed to the next guide: *"Configuring ESLint and Prettier for a TypeScript Project"* to ensure code quality and consistency.

