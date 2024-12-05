# Renting Flats System: Understanding MVC with TypeScript and Express.js

We'll explore the MVC (Model-View-Controller) architecture using TypeScript and Express.js. This tutorial is designed to help you understand how to structure your applications using the MVC pattern, a cornerstone of web development.

## Introduction to MVC Architecture

The MVC pattern is a software design pattern that separates an application into three main components:

- **Model**: Manages the data and business logic.
- **View**: Handles the display of information.
- **Controller**: Manages input and updates the model and view.

This separation of concerns helps keep your code organized and manageable, especially as your projects grow.

## Project Overview

We'll build a simple renting flats system that allows you to list available flats and add new ones. This project will demonstrate how to implement the MVC pattern using TypeScript and Express.js.

### Project Structure

```
renting-flats-system/
│
├── src/
│   ├── controllers/
│   │   └── FlatController.ts
│   ├── models/
│   │   └── Flat.ts
│   ├── routes/
│   │   └── flatRoutes.ts
│   ├── views/
│   ├── index.ts
│
├── package.json
├── tsconfig.json
```

## Step-by-Step Guide

### 1. Initialize the Project

First, create a new directory for your project and initialize a Node.js project:

```bash
mkdir renting-flats-system
cd renting-flats-system
npm init -y
npm install express @types/express typescript ts-node nodemon body-parser
```

Create a `tsconfig.json` file to configure TypeScript:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

**Explanation**: Here, we're setting up a basic Node.js project with TypeScript. The `tsconfig.json` file configures TypeScript to compile our code to ES6 JavaScript, using commonjs modules, and specifies the input and output directories. This setup ensures our TypeScript code is compiled correctly and ready to run in a Node.js environment.

### 2. Create the Model

The model represents the data and business logic. Create a file `src/models/Flat.ts`:

```typescript
export interface Flat {
  id: number;
  address: string;
  rent: number;
  isAvailable: boolean;
}

export class FlatModel {
  private flats: Flat[] = [
    { id: 1, address: "123 Main St", rent: 1200, isAvailable: true },
    { id: 2, address: "456 Elm St", rent: 1500, isAvailable: false },
  ];

  getAllFlats(): Flat[] {
    return this.flats;
  }

  addFlat(flat: Flat): Flat {
    flat.id = this.flats.length + 1;
    this.flats.push(flat);
    return flat;
  }
}
```

**Explanation**: The `Flat` interface defines the structure of a flat object, ensuring consistency in our data. The `FlatModel` class manages the data, providing methods to retrieve all flats and add a new flat. This encapsulation of data and logic within the model ensures that the rest of the application interacts with the data in a controlled manner, adhering to the MVC principle of separating concerns.

### 3. Create the Controller

The controller handles the logic for interacting with the model. Create a file `src/controllers/FlatController.ts`:

```typescript
import { Request, Response } from 'express';
import { FlatModel } from '../models/Flat';

const flatModel = new FlatModel();

export class FlatController {
  getFlats(req: Request, res: Response) {
    const flats = flatModel.getAllFlats();
    res.json(flats);
  }

  addFlat(req: Request, res: Response) {
    const newFlat = req.body;
    const addedFlat = flatModel.addFlat(newFlat);
    res.status(201).json(addedFlat);
  }
}
```

**Explanation**: The `FlatController` class acts as an intermediary between the model and the view. It receives input from the client (via HTTP requests), interacts with the `FlatModel` to perform operations, and sends back the appropriate response. This separation allows the controller to manage the flow of data and logic, keeping the model and view independent of each other.

### 4. Create the Routes

Routes define the API endpoints and connect them to the controller functions. Create a file `src/routes/flatRoutes.ts`:

```typescript
import express from 'express';
import { FlatController } from '../controllers/FlatController';

const router = express.Router();
const flatController = new FlatController();

router.get('/flats', (req, res) => flatController.getFlats(req, res));
router.post('/flats', (req, res) => flatController.addFlat(req, res));

export default router;
```

**Explanation**: The `flatRoutes` file sets up the API endpoints for our application. It uses Express's routing capabilities to map HTTP requests to specific controller methods. This setup allows us to define clear entry points for client interactions, ensuring that requests are handled appropriately by the controller.

### 5. Set Up the Express App

Set up the Express server to use the routes. Create a file `src/index.ts`:

```typescript
import express from 'express';
import bodyParser from 'body-parser';
import flatRoutes from './routes/flatRoutes';

const app = express();
app.use(bodyParser.json());

app.use('/api', flatRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

**Explanation**: This file initializes the Express application, sets up middleware for parsing JSON requests, and registers the routes. By organizing our application in this way, we ensure that the server is ready to handle incoming requests and route them to the appropriate controller methods.

### 6. Run the Application

Use `nodemon` to run the application:

```bash
npx nodemon src/index.ts
```

**Explanation**: `nodemon` is a utility that automatically restarts the server whenever file changes are detected. This is particularly useful during development, as it allows you to see the effects of your changes immediately without manually restarting the server.

### 7. Test the API

- **List Flats**: Send a GET request to `http://localhost:3000/api/flats` to retrieve the list of flats.
- **Add a Flat**: Send a POST request to `http://localhost:3000/api/flats` with a JSON body like `{"address": "789 Oak St", "rent": 1300, "isAvailable": true}` to add a new flat.

**Explanation**: Testing the API endpoints allows you to verify that the MVC components are working together as expected. The GET request retrieves data from the model via the controller, while the POST request adds new data, demonstrating the flow of data through the MVC architecture.

---

This tutorial is designed to give you a hands-on understanding of the MVC pattern using TypeScript and Express.js.
 By following these steps, you'll see how the separation of concerns in MVC helps create a well-organized and scalable application.

 Enjoy building your renting flats system!
