### Guide 3: Dockerizing the Frontend React Project

This guide explains how to set up Docker for a React frontend project while following best practices. While inspired by backend configurations, frontend Dockerization focuses on optimizing build size, caching, and serving static files efficiently.

---

### Step 1: Create a Dockerfile

Create a `Dockerfile` in the root of your React project. Use the following configuration:

```dockerfile
# Use the official Node.js image as a builder
FROM node:16 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code into the container
COPY . .

# Build the React app
RUN npm run build

# Use a lightweight web server to serve static files
FROM nginx:1.21 AS production

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Remove the default NGINX static files
RUN rm -rf ./*

# Copy built files from the builder stage
COPY --from=builder /app/build .

# Expose the default NGINX port
EXPOSE 80

# Start the NGINX server
CMD ["nginx", "-g", "daemon off;"]
```

---

### Step 2: Create a `.dockerignore` File

To reduce the image size, exclude unnecessary files by creating a `.dockerignore` file:

```
node_modules
build
.dockerignore
Dockerfile
.env.local
```

---

### Step 3: Write a `docker-compose.yml` File

If your React app will interact with other services, use `docker-compose` to manage multiple containers. Here’s a sample configuration:

```yaml
version: '3.8'

services:
  react-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:80" # Map React app to port 3000 on the host
    environment:
      REACT_APP_API_URL: "http://backend-service:5000"
    depends_on:
      - backend-service

  backend-service:
    image: my-backend-image
    container_name: backend-service
    ports:
      - "5000:5000"
    env_file:
      - .env
```

This setup assumes that the React app needs to connect to a backend service running in Docker.

---

### Step 4: Build and Run the Docker Image

1. **Build the Docker Image:**

   ```bash
   docker build -t react-app .
   ```

2. **Run the Docker Container:**

   ```bash
   docker run -p 3000:80 react-app
   ```

3. **Using Docker Compose (Optional):**

   ```bash
   docker-compose up
   ```

---

### Step 5: Optimize for Production

- **Multi-Stage Build:** The `Dockerfile` uses multi-stage builds to keep the final image lightweight by discarding development dependencies.
- **NGINX Configuration:** You can customize NGINX to enable caching, compression, or custom error pages by adding an `nginx.conf` file to your project:

   ```nginx
   server {
       listen 80;
       server_name _;

       root /usr/share/nginx/html;
       index index.html;

       location / {
           try_files $uri /index.html;
       }

       location ~* \.(?:ico|css|js|gif|jpg|jpeg|png|svg|woff|woff2|ttf|otf|eot)$ {
           expires 6M;
           access_log off;
       }
   }
   ```

   Copy this configuration into the container by adding to the `Dockerfile`:

   ```dockerfile
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   ```

- **Environment Variables:** Use `REACT_APP_` prefixed variables for environment-specific configurations. Add these to the `docker-compose.yml` or `.env` file.

---

### Step 6: Test the Setup

- Visit `http://localhost:3000` to verify the application.
- Ensure all environment variables are properly injected and endpoints are working.

---

### Best Practices for Frontend Dockerization

1. **Minimize Image Size:**
   - Use multi-stage builds.
   - Use lightweight base images like `nginx:alpine`.

2. **Leverage Caching:**
   - Copy only `package.json` and `package-lock.json` before running `npm install` to maximize Docker layer caching.

3. **Serve Static Files with NGINX or Caddy:**
   - Avoid using Node.js for serving static files in production. Instead, use optimized web servers like NGINX.

4. **CI/CD Integration:**
   - Add Docker build and push steps in your CI/CD pipeline for seamless deployment.

5. **Security:**
   - Avoid hardcoding secrets in the `Dockerfile`. Use `.env` files or Docker secrets for sensitive data.
