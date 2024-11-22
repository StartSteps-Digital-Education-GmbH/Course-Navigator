### Guide: Setup Multiple Environments for Testing, development and prod

This guide incorporates:
1. Setting up multiple environments (dev, test, prod) using `.env` files.
2. Using Docker to manage the PostgreSQL database for all environments.
3. Running the app and tests in a single step with the `test` command.
4. Automatically creating databases (`dev`, `test`, `prod`) on container startup.
5. Best practices for using `dev` and `prod` environments in Docker.

---

### **1. Environment Configuration**

Prepare `.env` files for each environment. These will control the database and server configuration.

#### **.env (Development)**
```env
PORT=5000
POSTGRES_USER=news_admin
POSTGRES_PASSWORD=news_admin
POSTGRES_DB=news_app_dev
POSTGRES_HOST=postgres
JWT_SECRET=dev_secret
NODE_ENV=development
```

#### **.env.test (Testing)**
```env
PORT=5001
POSTGRES_USER=news_admin
POSTGRES_PASSWORD=news_admin
POSTGRES_DB=news_app_test
POSTGRES_HOST=localhost
JWT_SECRET=test_secret
NODE_ENV=test
```

#### **.env.prod (Production)**
```env
PORT=5000
POSTGRES_USER=news_admin
POSTGRES_PASSWORD=news_admin
POSTGRES_DB=news_app_prod
POSTGRES_HOST=postgres
JWT_SECRET=prod_secret
NODE_ENV=production
```

---

### **2. Database Initialization Script**

Create a script to initialize all databases when the PostgreSQL container starts. Add the following to a new file named `init-database.sh` in the project root:

#### **init-database.sh**
```bash
#!/bin/bash
set -e

# Create databases
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE news_app_dev;
    CREATE DATABASE news_app_test;
    CREATE DATABASE news_app_prod;
EOSQL
```

Update your `docker-compose.yml` to use this script as an initialization step for PostgreSQL.

---

### **3. Docker Compose Configuration**

Here’s an updated `docker-compose.yml`:

#### **docker-compose.yml**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: postgres-db-news-app
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $POSTGRES_USER -d $POSTGRES_DB"]
      interval: 10s
      timeout: 5s
      retries: 5
    volumes:
      - ./init-database.sh:/docker-entrypoint-initdb.d/init-database.sh
    env_file:
      - .env

  news_app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    depends_on:
      postgres:
        condition: service_healthy
    env_file:
      - .env
```

- **Explanation**: The `init-database.sh` script will create the `dev`, `test`, and `prod` databases automatically. It’s mounted to the PostgreSQL container as an initialization script.

---

### **4. App Initialization**

Modify `src/index.ts` to ensure it works for all environments, with proper database initialization.

#### **src/index.ts**
```typescript
import dotenv from "dotenv";
import app from "./app";
import { AppDataSource } from "./data-source";

// Load the correct .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === "production" 
  ? ".env.prod" 
  : process.env.NODE_ENV === "test" 
    ? ".env.test" 
    : ".env";
dotenv.config({ path: envFile });

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
```

---

### **5. Test Setup**

Tests need the app running and should use the test database. Update your Jest configuration and global setup:

#### **jest.config.js**
```javascript
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  globalSetup: "./src/tests/setupTestEnv.ts",
};
```

#### **src/tests/setupTestEnv.ts**
```typescript
import { AppDataSource } from "../data-source";

export default async () => {
  process.env.NODE_ENV = "test"; // Set test environment
  await AppDataSource.initialize(); // Initialize the test database
};
```

#### **Test Scripts**

Add a `test:run` command to start the app, run tests, and shut down the app.

#### **Updated `package.json`**
```json
"scripts": {
  "dev": "nodemon -r dotenv/config src/index.ts",
  "start": "NODE_ENV=production node dist/index.js",
  "test:run": "NODE_ENV=test jest && pkill -f 'node src/index.ts'",
  "test": "NODE_ENV=test jest",
  "build": "tsc"
}
```

- `test:run`: Starts the app with the `test` environment, runs Jest, and stops the app.

---

### **6. Development and Production in Docker**

- **Development**: Use the `.env` file to run the app in development mode.
  ```bash
  docker-compose up
  ```

- **Production**: Switch to `.env.prod` for the production environment.
  ```bash
  docker-compose --env-file .env.prod up --build
  ```

---

### **7. Run the App and Tests**

- **Start in Development**:
  ```bash
  npm run dev
  ```

- **Run Tests** (with the app):
  ```bash
  npm run test:run
  ```

- **Build and Start in Production**:
  ```bash
  npm run build
  npm start
  ```

---

### **Summary**

1. **Docker** manages PostgreSQL with automatic database creation using `init-database.sh`.
2. Environment variables (`.env`, `.env.test`, `.env.prod`) control the app for `dev`, `test`, and `prod`.
3. Tests run with a dedicated database and app instance (`npm run test:run`).
4. Use `dev` during development in Docker and `prod` for production.
