### Guide: Setup Multiple Environments for Testing, Development, and Production

This step-by-step guide outlines how to configure and run a Node.js application with separate environments (`dev`, `test`, `prod`) using `.env` files, Docker for PostgreSQL management, and efficient scripts for development and testing.

---

### **1. Environment Configuration**

Set up environment variables for each environment by creating separate `.env` files.

#### **.env (Development)**
```env
PORT=5000
POSTGRES_USER=news_admin
POSTGRES_PASSWORD=news_admin
POSTGRES_DB=news_app_db
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
POSTGRES_DB=news_app_db
POSTGRES_HOST=postgres
JWT_SECRET=prod_secret
NODE_ENV=production
```

---

### **2. Database Initialization**

To automate database creation, write an initialization script named `init-database.sh`:

#### **init-database.sh**
```bash
#!/bin/bash
set -e

# Create the required databases
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    CREATE DATABASE news_app_db;
    CREATE DATABASE news_app_test;
EOSQL
```

Place this script in the project root and configure Docker to use it during PostgreSQL startup.

---

### **3. Docker Compose Configuration**

Set up Docker to manage PostgreSQL and the application. Use the following `docker-compose.yml`:

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
    env_file:
      - .env.prod
    volumes:
      - ./init-database.sh:/docker-entrypoint-initdb.d/init-database.sh

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
      - .env.prod
```

---

### **4. Application Setup**

Modify your app's configuration to dynamically load the correct `.env` file based on the environment.

#### **config/env.ts**
```typescript
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "production"
  ? ".env.prod"
  : process.env.NODE_ENV === "test"
    ? ".env.test"
    : ".env";

dotenv.config({ path: envFile });

export const configs = {
  PORT: process.env.PORT || 5000,
  database: {
    POSTGRES_HOST: process.env.POSTGRES_HOST || "postgres",
    POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT || "5432"),
    POSTGRES_USER: process.env.POSTGRES_USER || "news_admin",
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || "news_admin",
    POSTGRES_DB: process.env.POSTGRES_DB || "news_app_db",
  },
  auth: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
};
```

---

### **5. Package Scripts**

Configure scripts in `package.json` for development, testing, and production.

#### **package.json**
```json
"scripts": {
  "dev": "nodemon -r dotenv/config src/index.ts",
  "build": "tsc",
  "start": "NODE_ENV=production node dist/index.js",
  "test": "NODE_ENV=test jest"
}
```

---

### **6. Development and Production with Docker**

- **Development**: Run the app with the `.env` file for development.
  ```bash
  docker-compose up
  ```

- **Production**: Switch to the `.env.prod` file for production.
  ```bash
  docker-compose --env-file .env.prod up --build
  ```

---

### **7. Testing**

Run tests with the `test` script. Ensure the app uses the `test` environment.

- **Run Tests**:
  ```bash
  npm run test
  ```

---

### **8. Start the Application**

- **Development Mode**:
  ```bash
  npm run dev
  ```

- **Production Mode**:
  ```bash
  npm run build
  npm start
  ```

---

### **Summary**

1. Environment variables in `.env` files provide flexibility for development, testing, and production.
2. Docker simplifies database setup with automatic initialization (`init-database.sh`).
3. Efficient scripts (`npm run dev`, `npm run test`, etc.) streamline workflows for development and testing.
