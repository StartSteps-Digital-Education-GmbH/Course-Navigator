## **Step 1: Create the Project Directory**
1. Open your terminal and create a new directory:
   ```bash
   mkdir news-aggregator
   cd news-aggregator
   ```

2. Initialize a Git repository:
   ```bash
   git init
   ```

---

## **Step 2: Initialize the Project**
1. Run the following command to create a `package.json` file:
   ```bash
   npm init -y
   ```

2. Add the following dependencies and devDependencies:
   ```bash
   npm install express pg dotenv
   npm install --save-dev typescript ts-node @types/node @types/express nodemon
   ```

---

## **Step 3: Setup TypeScript**
1. Generate a `tsconfig.json` file:
   ```bash
   npx tsc --init
   ```

2. Update `tsconfig.json` to include:
   ```json
   {
       "compilerOptions": {
           "target": "ES6",
           "module": "commonjs",
           "rootDir": "./src",
           "outDir": "./dist",
           "strict": true,
           "esModuleInterop": true,
           "skipLibCheck": true
       },
       "include": ["src/**/*"],
       "exclude": ["node_modules", "dist"]
   }
   ```

---

## **Step 4: Create the Directory Structure**
1. Create the following folders:
   ```bash
   mkdir -p src/config src/controllers src/routes src/models src/utils
   ```

2. Add the following files:
   - `src/index.ts`: Entry point of the application.
   - `src/routes/index.ts`: API routes will be defined here.
   - `src/config/database.ts`: Database connection setup.

---

## **Step 5: Setup Express Server**
1. Open `src/index.ts` and add the boilerplate code:
   ```typescript
   import express from 'express';

   const app = express();

   // Middleware
   app.use(express.json());

   // Routes
   app.get('/', (req, res) => {
       res.send('News Aggregator API is running!');
   });

   // Start Server
   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
       console.log(`Server running on http://localhost:${PORT}`);
   });
   ```

2. Link the routes in `src/routes/index.ts`:
   ```typescript
   import { Router } from 'express';

   const router = Router();

   // Add your routes here
   router.get('/news', (req, res) => {
       res.json({ message: 'List of news' });
   });

   export default router;
   ```

   Update `src/index.ts` to use the routes:
   ```typescript
   import routes from './routes';
   app.use('/api', routes);
   ```

---

## **Step 6: Configure Docker**
1. Create a `Dockerfile`:
   ```dockerfile
   # Use Node.js base image
   FROM node:18

   # Set working directory
   WORKDIR /usr/src/app

   # Copy package.json and install dependencies
   COPY package*.json ./
   RUN npm install

   # Copy project files
   COPY . .

   # Build the TypeScript files
   RUN npm run build

   # Expose the port
   EXPOSE 5000

   # Start the server
   CMD ["npm", "start"]
   ```

2. Create a `.dockerignore` file:
   ```dockerfile
   node_modules
   dist
   .env
   ```

3. Create a `docker-compose.yml` to include PostgreSQL:
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - '5000:5000'
       volumes:
         - .:/usr/src/app
         - /usr/src/app/node_modules
       depends_on:
         - db
       environment:
         - DB_HOST=db
         - DB_PORT=5432
         - DB_USER=postgres
         - DB_PASSWORD=postgres
         - DB_NAME=news_db

     db:
       image: postgres:15
       restart: always
       environment:
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: postgres
         POSTGRES_DB: news_db
       ports:
         - '5432:5432'
       volumes:
         - pgdata:/var/lib/postgresql/data

   volumes:
     pgdata:
   ```

---

## **Step 7: Add Scripts to `package.json`**
Update `package.json` to include:
```json
"scripts": {
   "start": "node dist/index.js",
   "dev": "nodemon src/index.ts",
   "build": "tsc"
}
```

---

## **Step 8: Run the Project**
1. Build the Docker containers:
   ```bash
   docker-compose up --build
   ```

2. Access the API at:
   ```
   http://localhost:5000
   ```
