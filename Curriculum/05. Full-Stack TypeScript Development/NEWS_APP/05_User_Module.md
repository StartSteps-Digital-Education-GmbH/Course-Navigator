
### Step-by-Step Guide: Building the User Module for the Backend

This guide will help you build the **User** module, covering the creation of the **entity**, **routes**, **controller handlers**, **middleware**, and **tests**. We will follow the structure established earlier with TypeORM, Express.js, and Docker.

---

### **1. Define the User Entity**

Create a file for the user entity in the `src/entities` directory:

**`src/entities/User.ts`**
```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

### **2. Create the User Routes**

Define routes for user-related functionality in `src/routes/user.routes.ts`:

**`src/routes/user.routes.ts`**
```typescript
import { Router } from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/user.controller";
import { validateRequest } from "../middleware/validateRequest";
import { authMiddleware } from "../middleware/authMiddleware";
import { registerSchema, loginSchema } from "../validation/user.validation";

const router = Router();

// Public Routes
router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);

// Protected Routes
router.get("/profile", authMiddleware, getUserProfile);

export default router;
```

---

### **3. Write the Controller Handlers**

Define controller logic for user-related functionality in `src/controllers/user.controller.ts`:

**`src/controllers/user.controller.ts`**
```typescript
import { Request, Response } from "express";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(User);

// Register a new user
export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({ email, password: hashedPassword });
    await userRepository.save(user);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Error creating user" });
  }
};

// Login a user
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await userRepository.findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: "Error logging in" });
  }
};

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  const userId = req.user.id;

  try {
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Error retrieving profile" });
  }
};
```

---

### **4. Add Middleware**

#### **Auth Middleware**
**`src/middleware/authMiddleware.ts`**
```typescript
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded as { id: number };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
```

#### **Validation Middleware**
**`src/middleware/validateRequest.ts`**
```typescript
import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

export const validateRequest = (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};
```

---

### **5. Create Validation Rules**

Define Joi validation schemas for user registration and login:

**`src/validation/user.validation.ts`**
```typescript
import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
```

---

### **6. Write Tests**

Create tests for user-related endpoints in `src/tests/user.test.ts`:

**`src/tests/user.test.ts`**
```typescript
import request from "supertest";
import app from "../app";

describe("User Routes", () => {
  it("should register a user", async () => {
    const res = await request(app).post("/api/users/register").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  it("should login a user", async () => {
    await request(app).post("/api/users/register").send({
      email: "test@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/users/login").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should get user profile", async () => {
    const registerRes = await request(app).post("/api/users/register").send({
      email: "test@example.com",
      password: "password123",
    });

    const loginRes = await request(app).post("/api/users/login").send({
      email: "test@example.com",
      password: "password123",
    });

    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("test@example.com");
  });
});
```

---

### **7. Add to Main App**

Integrate the user routes into your main app:

**`src/app.ts`**
```typescript
import express from "express";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(express.json());
app.use("/api/users", userRoutes);

export default app;
```

---

### **Final Steps**
1. Run your application:
   ```bash
   docker-compose up --build
   ```
2. Test the API using Postman or your test suite.
3. Ensure the endpoints work as expected.
