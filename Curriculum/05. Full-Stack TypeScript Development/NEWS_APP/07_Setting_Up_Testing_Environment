### **Guide: Setting Up Testing Environment**

This guide will walk you through the steps to set up a robust testing environment for a TypeScript project with the following features: 

1. **Database and server separation during tests**.
2. **Support for ES Modules in Jest**.
3. **Environment-specific configurations for testing**.
4. **Running tests with a clean database state**.
5. **Cross-platform compatibility using `cross-env`**.

---

### **1. Project Structure**
Before proceeding, ensure your project is structured as follows:
```
src/
  ├── config/
  │     ├── env.ts
  │     ├── database.ts
  ├── entities/
  ├── routes.ts
  ├── index.ts
  ├── tests/
        ├── user.test.ts
jest.config.js
babel.config.json
package.json
```

---

### **2. Install Required Dependencies**
Run the following command to install dependencies for testing, TypeScript, and module support:
```bash
npm install --save-dev jest ts-jest supertest @babel/preset-env cross-env @types/jest @types/supertest
```

---

### **3. Environment Configuration**
Set up environment files for different configurations.

#### `.env` (Development)
```env
PORT=5000
POSTGRES_USER=dev_user
POSTGRES_PASSWORD=dev_password
POSTGRES_DB=dev_db
POSTGRES_HOST=localhost
NODE_ENV=development
```

#### `.env.test` (Testing)
```env
PORT=5001
POSTGRES_USER=test_user
POSTGRES_PASSWORD=test_password
POSTGRES_DB=test_db
POSTGRES_HOST=localhost
NODE_ENV=test
```

---

### **4. Setting Up the Database**
Ensure your `connectDB` function initializes the database based on the current environment.

#### `src/config/database.ts`
```typescript
import { DataSource } from "typeorm";
import { configs } from "./env.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: configs.POSTGRES_HOST,
  port: 5432,
  username: configs.POSTGRES_USER,
  password: configs.POSTGRES_PASSWORD,
  database: configs.POSTGRES_DB,
  synchronize: true, // Set to false in production
  entities: ["src/entities/*.ts"],
});

export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log(`Database connected: ${configs.POSTGRES_DB}`);
  } catch (error) {
    console.error("Database connection error:", error);
  }
};
```

#### Key Points:
- Use `configs` to load environment variables dynamically.
- Ensure the `test_db` database exists for running tests.

---

### **5. Configuring the Server**
Update your `index.ts` to avoid starting the server during tests.

#### `src/index.ts`
```typescript
import express from 'express';
import { configs } from './config/env.js';
import { connectDB } from './config/database.js';
import router from './routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use('/api', router);

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(configs.PORT, () => {
      console.log(`Server is running on port ${configs.PORT}`);
    });
  });
}

export default app;
```

---

### **6. Jest Configuration**
Set up Jest for testing TypeScript and ES Modules.

#### `jest.config.js`
```javascript
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
```

#### `babel.config.json`
```json
{
  "presets": ["@babel/preset-env"]
}
```

---

### **7. Add Cross-Environment Support**
Install `cross-env` to handle `NODE_ENV` across platforms:
```bash
npm install --save-dev cross-env
```

Update the test script in `package.json`:
```json
"scripts": {
  "test": "cross-env NODE_ENV=test jest",
  "test:watch": "cross-env NODE_ENV=test jest --watch"
}
```

---

### **8. Test File Example**
Create a test file for user routes.

#### `src/tests/user.test.ts`
```typescript
import app from "../index.js";
import request from "supertest";
import { AppDataSource } from "../config/database.js";

beforeAll(async () => {
  await AppDataSource.initialize(); // Initialize the test database
});

afterAll(async () => {
  await AppDataSource.destroy(); // Close the test database connection
});

describe("User Tests", () => {
  it("should register a user", async () => {
    const res = await request(app).post('/api/users/register').send({
      email: 'testemail@test.com',
      password: 'testPassword',
      name: 'Test User'
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User Registered Successfully");
  });
});
```

---

### **9. Run Tests**
Run your tests using:
```bash
npm run test
```

### **10. Troubleshooting Common Issues**
- **Database Not Found**: Ensure the `test_db` database exists before running tests. You can create it manually or through Docker.
- **SyntaxError: Cannot Use Import Statement Outside a Module**: Ensure `babel.config.json` and `jest.config.js` are correctly configured.
- **Tests Hanging**: Ensure `AppDataSource.destroy()` is called in the `afterAll` block.

---

### **Summary**
1. Use `jest`, `ts-jest`, and `supertest` for testing.
2. Handle cross-environment configurations using `cross-env`.
3. Initialize the database properly for `test` mode.
4. Ensure your server does not start during tests.
5. Write isolated tests with proper setup and teardown.

This setup ensures a smooth development and testing workflow.
