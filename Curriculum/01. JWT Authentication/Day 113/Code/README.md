# Json Web Token 'JWT' Example

Here is a simple complete code example for a sign-up and sign-in functionality using Node.js, Express, TypeScript, MongoDB, and JWT for authentication. This example assumes you have already set up your environment as described in the previous guide.

### 1. Project Structure

```
/my-api
|-- /src
|   |-- /controllers
|   |   |-- authController.ts
|   |-- /models
|   |   |-- User.ts
|   |-- /routes
|   |   |-- authRoutes.ts
|   |-- /middleware
|   |   |-- authMiddleware.ts
|   |-- app.ts
|-- package.json
|-- tsconfig.json
```

### 2. Install Required Packages

Run the following command to install the necessary packages:

```bash
npm install express mongoose jsonwebtoken bcryptjs dotenv
npm install --save-dev typescript @types/node @types/express @types/mongoose @types/jsonwebtoken @types/bcryptjs
```

### 3. Create TypeScript Configuration

Create a `tsconfig.json` file in the root of your project:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 4. Create User Model

Create a file `src/models/User.ts`:

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const User = mongoose.model<IUser>('User', UserSchema);
```

### 5. Create Authentication Controller

Create a file `src/controllers/authController.ts`:

```typescript
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const signUp = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error signing in', error });
  }
};
```

### 6. Create Authentication Routes

Create a file `src/routes/authRoutes.ts`:

```typescript
import { Router } from 'express';
import { signUp, signIn } from '../controllers/authController';

const router = Router();

router.post('/signup', signUp);
router.post('/signin', signIn);

export default router;
```

### 7. Create Middleware for Authentication

Create a file `src/middleware/authMiddleware.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = (decoded as any).id; // Attach user ID to request
    next();
  });
};
```

### 8. Create the Main Application File

Create a file `src/app.ts`:

```typescript
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myapi', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Use authentication routes
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

### 9. Environment Variables

Create a `.env` file in the root of your project:

```
MONGODB_URI=mongodb://localhost:27017/myapi
JWT_SECRET=your_jwt_secret
```

### 10. Running the Application

1. Compile TypeScript to JavaScript:

```bash
npx tsc
```

2. Start the server:

```bash
node dist/app.js
```

### 11. Testing the API

You can use tools like Postman or cURL to test the API.

- **Sign Up:**
  - **POST** `http://localhost:5000/api/auth/signup`
  - **Body:**
    ```json
    {
      "username": "testuser",
      "password": "password123"
    }
    ```

- **Sign In:**
  - **POST** `http://localhost:5000/api/auth/signin`
  - **Body:**
    ```json
    {
      "username": "testuser",
      "password": "password123"
    }
    ```

### Summary

In this guide, we created a simple REST API for user authentication using Node.js, Express, TypeScript, MongoDB, and JWT. We set up user sign-up and sign-in functionalities, hashed passwords, and generated JWTs for secure authentication. This foundational setup can be expanded with additional features and security measures as needed.
