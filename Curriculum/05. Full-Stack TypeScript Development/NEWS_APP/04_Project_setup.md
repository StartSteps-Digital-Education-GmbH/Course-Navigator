# **Setting Up a Backend with TypeScript, Express, TypeORM, and Docker (with PostgreSQL)**

This guide will help you set up a backend using **TypeScript**, **Express.js**, **TypeORM**, **Docker**, and **PostgreSQL**, with a modular structure, environment variable support, and ES module syntax.

---

## **Step 1: Initialize the Project**

1. **Create the Project Directory**:
   ```bash
   mkdir typeorm-backend && cd typeorm-backend
   ```

2. **Initialize the Node.js Project**:
   ```bash
   npm init -y
   ```

3. **Update `package.json`** for ES Module Syntax:
   Add `"type": "module"`:
   ```json
   {
       "name": "typeorm-backend",
       "version": "1.0.0",
       "type": "module",
       "scripts": {
           "dev": "nodemon",
           "build": "tsc",
           "start": "node dist/index.js"
       },
       "dependencies": {
           "express": "^4.18.2",
           "dotenv": "^16.1",
           "reflect-metadata": "^0.1.13",
           "typeorm": "^0.3.17",
           "pg": "^8.11.0"
       },
       "devDependencies": {
           "typescript": "^5.2.2",
           "ts-node": "^10.9.1",
           "@types/express": "^4.17.17",
           "@types/node": "^20.4.2",
           "nodemon": "^2.0.22",
           "tsconfig-paths": "^4.1.2"
       }
   }
   ```

4. **Install Dependencies**:
   ```bash
   npm install
   ```

5. **Install Development Dependencies**:
   ```bash
   npm install --save-dev typescript ts-node @types/node @types/express nodemon tsconfig-paths
   ```

---

## **Step 2: Configure TypeScript**

1. **Initialize TypeScript**:
   ```bash
   npx tsc --init
   ```

2. **Update `tsconfig.json`**:
   ```json
   {
       "compilerOptions": {
           "target": "ES2021",
           "module": "ESNext",
           "moduleResolution": "Node",
           "outDir": "./dist",
           "rootDir": "./src",
           "strict": true,
           "esModuleInterop": true,
           "experimentalDecorators": true,
           "emitDecoratorMetadata": true,
           "skipLibCheck": true,
           "forceConsistentCasingInFileNames": true,
           "baseUrl": "./src",
           "paths": {
               "@config/*": ["config/*"],
               "@app/*": ["app/*"],
               "@modules/*": ["modules/*"],
               "@utils/*": ["utils/*"]
           }
       },
       "include": ["src"],
       "exclude": ["node_modules"]
   }
   ```

3. **Set Up `nodemon`**:
   Create a `nodemon.json`:
   ```json
   {
       "watch": ["src"],
       "ext": "ts",
       "exec": "ts-node -r tsconfig-paths/register src/index.ts"
   }
   ```

---

## **Step 3: Set Up the Directory Structure**

Use this modular structure:
```plaintext
src/
├── app/
│   ├── index.ts         # App entry logic
│   └── middlewares.ts   # Global middlewares
├── config/
│   ├── database.ts      # TypeORM Data Source
│   └── env.ts           # Environment variable parser
├── entities/            # TypeORM Entities
│   ├── User.ts          # User entity
│   └── News.ts          # News entity
├── modules/             # Feature-based modules
│   ├── news/
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   └── route.ts
│   ├── user/
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   └── route.ts
├── utils/
│   └── logger.ts        # Logger utility
└── index.ts             # Entry point
```

---

## **Step 4: Configure TypeORM**

1. **Set Up a `.env` File**:
   Create a `.env` file in the project root:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=typeormdb
   ```

2. **Create a `src/config/env.ts`**:
   ```typescript
   import dotenv from 'dotenv';

   dotenv.config();

   export const config = {
       port: process.env.PORT || 3000,
       db: {
           host: process.env.DB_HOST || 'localhost',
           port: Number(process.env.DB_PORT) || 5432,
           user: process.env.DB_USER || 'postgres',
           password: process.env.DB_PASSWORD || 'postgres',
           name: process.env.DB_NAME || 'typeormdb',
       },
   };
   ```

3. **Set Up the TypeORM Data Source**:
   Create `src/config/database.ts`:
   ```typescript
   import 'reflect-metadata';
   import { DataSource } from 'typeorm';
   import { User } from '../entities/User.js';
   import { News } from '../entities/News.js';
   import { config } from './env.js';

   export const AppDataSource = new DataSource({
       type: 'postgres',
       host: config.db.host,
       port: config.db.port,
       username: config.db.user,
       password: config.db.password,
       database: config.db.name,
       entities: [User, News],
       synchronize: true,
       logging: true,
   });

   export const connectDB = async () => {
       try {
           await AppDataSource.initialize();
           console.log('Connected to the database');
       } catch (error) {
           console.error('Database connection failed:', error);
           process.exit(1);
       }
   };
   ```

---

## **Step 5: Define Entities**

1. **User Entity (`src/entities/User.ts`)**:
   ```typescript
   import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

   @Entity()
   export class User {
       @PrimaryGeneratedColumn()
       id!: number;

       @Column()
       name!: string;

       @Column({ unique: true })
       email!: string;

       @Column()
       password!: string;
   }
   ```

2. **News Entity (`src/entities/News.ts`)**:
   ```typescript
   import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

   @Entity()
   export class News {
       @PrimaryGeneratedColumn()
       id!: number;

       @Column()
       title!: string;

       @Column()
       content!: string;

       @Column()
       author!: string;
   }
   ```

---

## **Step 6: Set Up the Express Server**

1. **Create `src/index.ts`**:
   ```typescript
   import express from 'express';
   import dotenv from 'dotenv';
   import { connectDB } from './config/database.js';
   import userRoutes from './modules/user/route.js';
   import newsRoutes from './modules/news/route.js';

   dotenv.config();

   const app = express();
   const PORT = process.env.PORT || 3000;

   app.use(express.json());

   // Routes
   app.use('/api/users', userRoutes);
   app.use('/api/news', newsRoutes);

   // Start server
   app.listen(PORT, async () => {
       console.log(`Server running at http://localhost:${PORT}`);
       await connectDB();
   });
   ```

---

## **Step 7: Set Up Docker**

1. **Create `Dockerfile`**:
   ```dockerfile
   FROM node:18-alpine

   WORKDIR /usr/src/app

   COPY package*.json ./
   RUN npm install

   COPY . .

   RUN npm run build

   EXPOSE 3000

   CMD ["npm", "start"]
   ```

2. **Create `docker-compose.yml`**:
   ```yaml
   version: '3.8'

   services:
     app:
       build: .
       ports:
         - "3000:3000"
       volumes:
         - .:/usr/src/app
         - /usr/src/app/node_modules
       environment:
         - DB_HOST=db
         - DB_PORT=5432
         - DB_USER=postgres
         - DB_PASSWORD=postgres
         - DB_NAME=typeormdb

     db:
       image: postgres:15
       restart: always
       environment:
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: postgres
         POSTGRES_DB=typeormdb
       ports:
         - "5432:5432"
   ```

3. **Run the Project**:
   ```bash
   docker-compose up --build
   ```

---
