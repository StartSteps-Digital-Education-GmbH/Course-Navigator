

# Token based authentication with Express, JWT, and Typescript

Building web applications? You’ll probably need user authentication. As developers, it’s our responsibility to safeguard user data and ensure that only authorized individuals gain access to protected resources.

There are plenty of libraries available that handle authentication seamlessly, making our lives easier. However, there are instances when we simply want a straightforward authentication process or prefer to handle authentication ourselves without relying on a middleman. In such cases, we need to roll out our authentication, and that’s perfectly fine!

In this lesson, we’ll embark on a journey to explore the world of token-based authentication using a powerful stack of technologies: [Express](https://expressjs.com/), JWT (JSON Web Tokens), and TypeScript. By the end of this article, you’ll not only understand the fundamental concepts behind token-based authentication but also have a practical implementation that you can integrate into your projects.

We’ll start by setting up our development environment. Then, we’ll dive into the implementation details, covering user registration, login, and token management. Along the way, we’ll address security best practices, including password hashing, and token expiration.

*This lesson requires a basic understanding of Node.js and TypeScript.*

We will use Visual Studio Code as IDE and API testing tool (Postman, or whatever you use).

## Initialize Project

Initialize your project by running, I’ll be using npm for this app. You can replace it with yarn easily.

```bash

npm init -y

```

```bash

npm install express jsonwebtoken bcrypt

npm install --save-dev typescript @types/node @types/express ts-node

```

[ts-node](https://github.com/TypeStrong/ts-node) ⇒ simple tool to run TypeScript files directly.

Create a `tsconfig.json` file at the root of your project and add these options (you can modify these options or add more according to your needs).

```json

{
"compilerOptions": {
"target": "es2016",
"lib": ["ES2020"],
"module": "commonjs",
"outDir": "./dist",
"strict": true,
"esModuleInterop": true,
"skipLibCheck": true
},
"include": ["src/**/*"]

}

```
Create a `src` folder inside the root of your project. Then create the entry file of your app `app.ts`.

Let’s move to `package.json` and create our scripts to run the application.

```json
"scripts": {
"dev": "ts-node src/app.ts",
"compile": "tsc",
"start": "node dist/app.js"
}

```
`ts-node` will automatically restart the server on changes.
It’s time to write some actual code, should we?
Go to `app.ts` and initialize Express.
```typescript
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
const app = express();

const PORT = 8000;

app.use(bodyParser.json());

const users: { email: string; password: string; name: string }[] = []; // In-memory user storage

app.listen(PORT, () => {

console.log(`Server is running on http://localhost:${PORT}`);

});

```

This code sets up a basic Express server, listens on port 8000, and allows external access. It’s the foundation upon which you can build your Express-based web application, adding routes, middleware, and other functionality as needed.

Add a simple health-check route, to see if it’s working or not. Add this route after the app initialization.

```typescript

app.get('/healthcheck', (req, res) => {
res.send({ message: 'Success' });

});

```

Run your server by running `npm run dev` on the terminal, and see the log message if it’s successful or not. Go to Postman and perform a GET request on `http://localhost:8000/healthcheck` endpoint. It should return a success message.

Bonus: Graceful shutdown is a crucial practice in server-side programming, and it involves handling termination signals (such as ‘SIGINT’ and ‘SIGTERM’) gracefully to ensure that your application can exit safely and without causing data corruption or abrupt disruptions.

Add these lines in your `app.ts` before the server starts:

```typescript

const listeners = ['SIGINT', 'SIGTERM'];

listeners.forEach((signal) => {

process.on(signal, () => {

console.log('Shutting down gracefully...');

process.exit(0);

});

});

```

## App Structure

Let’s discuss our app structure before writing more code.

```
src
├── app.ts
└── modules
	└── user
		├── user.route.ts
		└── user.controller.ts

```

Our application is divided into modules. In our user module, we have 2 files:

- `user.route.ts` ⇒ handle user routes

- `user.controller.ts` ⇒ main logic of each route

## User Routes

Let’s create our user route. Go to `user.route.ts` and create a route function that receives the main app. Inside it, all the required routes are created which we are going to need for this application.

```typescript

import { Router } from 'express';
import { createUser, login } from './user.controller';

const router = Router();

router.post('/register', createUser);
router.post('/login', login);

export default router;

```

## User Controller

Now, let’s implement the user registration and login logic in `user.controller.ts`.

### User Registration

```typescript

const SALT_ROUNDS = 10;

export async function createUser(req: express.Request, res: express.Response) {

const { email, password, name } = req.body;

// Check if user already exists

const existingUser = users.find(user => user.email === email);

if (existingUser) {
return res.status(400).send({ message: 'User already exists with this email' });

}

// Hash the password
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

// Create new user
const newUser = { email, password: hashedPassword, name };

users.push(newUser); // Store user in memory

return res.status(201).send({ message: 'User registered successfully' });

}

```

### User Login

```typescript

export async function login(req: express.Request, res: express.Response) {

const { email, password } = req.body;

// Find user
const user = users.find(user => user.email === email);

if (!user) {
return res.status(401).send({ message: 'Invalid email or password' });

}

// Check password
const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
return res.status(401).send({ message: 'Invalid email or password' });

}

// Create JWT token
const token = jwt.sign({ email: user.email, name: user.name }, 'your_jwt_secret', { expiresIn: '1h' });

return res.send({ accessToken: token });

}

```

## Protecting Routes

We are authenticated, registered, and logged in. But we don’t need to protect our every route. There could be resources that can be used by not logged-in users also. So we will manually protect those routes, which are only for authenticated users.

For that, we can manually check if the header for cookies and verify the token every time.

In our `app.ts`, add these lines to create an authentication middleware.

```typescript

const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {

const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

if (!token) {
return res.status(401).send({ message: 'Authentication required' });

}

try {
const decoded = jwt.verify(token, 'your_jwt_secret');
req.user = decoded; // Attach user info to request
next();

} catch (err) {
return res.status(401).send({ message: 'Invalid token' });
}
};

```

Now, protect your route with `authenticate` middleware. Go to `user.route.ts`.

```typescript

router.get('/', authenticate, (req, res) => {
res.send({ message: 'Protected route accessed' });
});

```

## Logout

It’s very easy, just clear the cookies.

```typescript

export async function logout(req: express.Request, res: express.Response) {

// Clear the access token cookie (if you were using cookies)

// In this example, we are not using cookies, so just send a message

return res.send({ message: 'Logout successful' });

}

```

Add this logout handler to our `/logout` route in `user.route.ts`. It’s also a protected route because only a logged-in user can logout. Right.

```typescript

router.delete('/logout', authenticate, logout);

```

Let’s test this.

Now, try to access the `/` route. If you are authenticated, you should see the protected message. If not, you will receive an authentication required message.

In our journey through token-based authentication with Express, JWT, and TypeScript, we’ve learned how to create secure and user-friendly authentication systems. Express’s speed and flexibility, along with JWTs, give us a strong foundation. From starting our project to protecting routes, we’ve got the basics down. As we move forward, know that our apps are secure, our users are safe, and we are ready to create amazing things.

Thanks for reading :)

