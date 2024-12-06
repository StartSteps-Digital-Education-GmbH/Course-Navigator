# Renting Flats System: Advanced MVC with TypeScript, Express, PostgreSQL, and React

In this guide, we'll build a full-stack application using the MVC architecture with TypeScript, Express, PostgreSQL, and React. We'll enhance the architecture with a service and repository layer, use TypeORM for database interactions, and implement JWT for security. This tutorial will provide detailed steps and explanations for each component of the MVC pattern.

## Backend Setup

### 1. Initialize the Backend Project

1. **Create a new directory for the backend:**

   ```bash
   mkdir renting-flats-system
   cd renting-flats-system
   mkdir backend
   cd backend
   ```

2. **Initialize a Node.js project:**

   ```bash
   npm init -y
   ```

3. **Install necessary packages:**

   ```bash
   npm install express @types/express typescript ts-node nodemon typeorm reflect-metadata pg class-validator jsonwebtoken @types/jsonwebtoken
   ```

4. **Set up TypeScript configuration:**

   Create a `tsconfig.json` file:

   ```json
   {
     "compilerOptions": {
       "target": "ES6",
       "module": "commonjs",
       "outDir": "./dist",
       "rootDir": "./src",
       "strict": true,
       "esModuleInterop": true,
       "experimentalDecorators": true,
       "emitDecoratorMetadata": true
     }
   }
   ```

### 2. Set Up PostgreSQL

1. **Ensure PostgreSQL is installed and running.**

2. **Create a database for the project:**

   Connect to PostgreSQL and run:

   ```sql
   CREATE DATABASE renting_flats;
   ```

3. **Create a file `src/data-source.ts` to configure TypeORM:**

   ```typescript
   import { DataSource } from 'typeorm';

   export const AppDataSource = new DataSource({
     type: 'postgres',
     host: 'localhost',
     port: 5432,
     username: 'your_username',
     password: 'your_password',
     database: 'renting_flats',
     synchronize: true,
     logging: false,
     entities: ['src/models/**/*.ts'],
     migrations: [],
     subscribers: [],
   });
   ```

   Replace `'your_username'` and `'your_password'` with your PostgreSQL credentials.

### 3. Create the Model

1. **Create a directory for models:**

   ```bash
   mkdir -p src/models
   ```

2. **Create a file `src/models/Flat.ts`:**

   ```typescript
   import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
   import { IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';

   @Entity()
   export class Flat {
     @PrimaryGeneratedColumn()
     id!: number;

     @Column()
     @IsNotEmpty()
     address!: string;

     @Column('int')
     @IsNumber()
     rent!: number;

     @Column()
     @IsBoolean()
     isAvailable!: boolean;
   }
   ```

**Explanation**: The `Flat` class is an entity that represents the data structure and business logic. It uses TypeORM decorators to define the schema and class-validator for data validation. This is part of the **Model (M)** in MVC, responsible for defining the data schema and interacting with the database.

### 4. Create the Repository

1. **Create a directory for repositories:**

   ```bash
   mkdir -p src/repositories
   ```

2. **Create a file `src/repositories/flatRepository.ts`:**

   ```typescript
   import { AppDataSource } from '../data-source';
   import { Flat } from '../models/Flat';

   export const flatRepository = AppDataSource.getRepository(Flat);
   ```

**Explanation**: The repository provides a clean API for interacting with the database. It encapsulates database operations, allowing the rest of the application to remain agnostic of the underlying data source.

### 5. Create the Service

1. **Create a directory for services:**

   ```bash
   mkdir -p src/services
   ```

2. **Create a file `src/services/flatService.ts`:**

   ```typescript
   import { flatRepository } from '../repositories/flatRepository';
   import { Flat } from '../models/Flat';

   export const listFlats = async () => {
     return await flatRepository.find();
   };

   export const createFlat = async (flatData: Partial<Flat>) => {
     const flat = flatRepository.create(flatData);
     return await flatRepository.save(flat);
   };
   ```

**Explanation**: The service layer contains business logic and interacts with the repository. It processes data, applies business rules, and coordinates complex operations.

### 6. Create the Controller

1. **Create a directory for controllers:**

   ```bash
   mkdir -p src/controllers
   ```

2. **Create a file `src/controllers/flatController.ts`:**

   ```typescript
   import { Request, Response } from 'express';
   import { listFlats, createFlat } from '../services/flatService';
   import { validate } from 'class-validator';
   import { Flat } from '../models/Flat';

   export const getFlats = async (req: Request, res: Response) => {
     try {
       const flats = await listFlats();
       res.json(flats);
     } catch (error) {
       res.status(500).json({ error: 'Internal Server Error' });
     }
   };

   export const addFlat = async (req: Request, res: Response) => {
     try {
       const flatData = req.body;
       const flat = new Flat();
       Object.assign(flat, flatData);

       const errors = await validate(flat);
       if (errors.length > 0) {
         return res.status(400).json(errors);
       }

       const newFlat = await createFlat(flatData);
       res.status(201).json(newFlat);
     } catch (error) {
       res.status(500).json({ error: 'Internal Server Error' });
     }
   };
   ```

**Explanation**: The controller manages input and updates the model and view. It handles HTTP requests, calls the appropriate service functions, and returns responses. This is part of the **Controller (C)** in MVC, responsible for managing the flow of data between the model and view.

### 7. Create the Routes

1. **Create a directory for routes:**

   ```bash
   mkdir -p src/routes
   ```

2. **Create a file `src/routes/flatRoutes.ts`:**

   ```typescript
   import express from 'express';
   import { getFlats, addFlat } from '../controllers/flatController';

   const router = express.Router();

   router.get('/flats', getFlats);
   router.post('/flats', addFlat);

   export default router;
   ```

**Explanation**: The routes define the API endpoints and connect them to the controller functions. This setup allows us to define clear entry points for client interactions, ensuring that requests are handled appropriately by the controller.

### 8. Set Up the Express App

1. **Create the main entry file `src/index.ts`:**

   ```typescript
   import 'reflect-metadata';
   import express from 'express';
   import flatRoutes from './routes/flatRoutes';
   import { AppDataSource } from './data-source';

   const app = express();
   app.use(express.json());

   app.use('/api', flatRoutes);

   const PORT = process.env.PORT || 3000;

   AppDataSource.initialize()
     .then(() => {
       app.listen(PORT, () => {
         console.log(`Server is running on port ${PORT}`);
       });
     })
     .catch((error) => console.log('Error during Data Source initialization', error));
   ```

2. **Run the backend server:**

   ```bash
   npx nodemon src/index.ts
   ```

**Explanation**: This file initializes the Express application, sets up middleware for parsing JSON requests, and registers the routes. It also initializes the TypeORM data source, ensuring that the server is ready to handle incoming requests and route them to the appropriate controller methods.

## Frontend Setup

### 1. Initialize the Frontend Project

1. **Create a new directory for the frontend:**

   ```bash
   cd ..
   npx create-react-app frontend --template typescript
   cd frontend
   ```

2. **Install Axios for API requests:**

   ```bash
   npm install axios
   ```

### 2. Create the FlatList Component

1. **Create a directory for components:**

   ```bash
   mkdir -p src/components
   ```

2. **Create a file `src/components/FlatList.tsx`:**

   ```tsx
   import React, { useEffect, useState } from 'react';
   import axios from 'axios';

   interface Flat {
     id: number;
     address: string;
     rent: number;
     isAvailable: boolean;
   }

   const FlatList: React.FC = () => {
     const [flats, setFlats] = useState<Flat[]>([]);

     useEffect(() => {
       const fetchFlats = async () => {
         try {
           const response = await axios.get('/api/flats');
           setFlats(response.data);
         } catch (error) {
           console.error('Error fetching flats:', error);
         }
       };

       fetchFlats();
     }, []);

     return (
       <div>
         <h1>Available Flats</h1>
         <ul>
           {flats.map(flat => (
             <li key={flat.id}>
               {flat.address} - ${flat.rent} - {flat.isAvailable ? 'Available' : 'Not Available'}
             </li>
           ))}
         </ul>
       </div>
     );
   };

   export default FlatList;
   ```

**Explanation**: The `FlatList` component fetches the list of flats from the backend using Axios and displays them. This component is part of the **View (V)** in MVC, responsible for rendering the data to the user.

### 3. Set Up the App Component

1. **Modify `src/App.tsx` to include the `FlatList` component:**

   ```tsx
   import React from 'react';
   import FlatList from './components/FlatList';

   const App: React.FC = () => {
     return (
       <div className="App">
         <FlatList />
       </div>
     );
   };

   export default App;
   ```

### 4. Run the Frontend Application

1. **Start the React development server:**

   ```bash
   npm start
   ```

**Explanation**: The `App` component serves as the root component of the React application, rendering the `FlatList` component. This setup allows the frontend to interact with the backend, fetching and displaying data as part of the **View (V)** in MVC.

---

This detailed guide provides all the necessary steps and CLI commands to set up a full-stack application using the MVC pattern with a functional approach. By following these steps, you'll see how the separation of concerns in MVC helps create a well-organized and scalable application. Enjoy building your renting flats system!
