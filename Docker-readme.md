# Travel Destinations App - Docker Setup

This README outlines the steps to set up and run the Travel Destinations application using Docker and Docker Compose.

## Prerequisites

1. **Install Docker Desktop**:
   - Ensure Docker Desktop is installed on your machine.

2. **Verify Installation**:
   - Open a terminal and run the following commands to check if Docker and Docker Compose are installed:
     ```bash
     docker --version
     docker-compose --version
     ```

---

## Scenario 1: Running the App with Docker

### Step 1: Create a Dockerfile

Create a file named `Dockerfile` in your project directory with the following content:

```dockerfile
# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /src

# Copy package.json and package-lock.json to the working directory
COPY package.json /src

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . /src

# Expose the port your app runs on (for example, 3000)
EXPOSE 3000

# Command to start your app
CMD ["npm", "start"]
```

### Step 2: Build and Run the Docker Container
Navigate to the directory where the Dockerfile is located and run the following commands:

To build the image:
```bash
docker buildx build -t travel-destinations-image .
```

To run the container:
```bash
docker run -d -p 3000:3000 --name travel-app travel-destinations-image
```

To stop the container (can also be done inside Docker Desktop):
```bash
docker stop travel-app
```

## Scenario 2: Running the App with Docker Compose

### Step 1: Create a docker-compose.yml File

```yml
version: '3'
services:
  app:
    build: .
    working_dir: /usr/src/app
    volumes:
      - .:/usr/src/app
    ports:
      - "3000:3000"
    command: npm start
    environment:
      NODE_ENV: development
      MONGO_URI_REMOTE: mongodb://mongodb:27017/Travel
      SECRET_KEY: superSecretKey

  mongodb:
    image: mongo
    ports:
      - "27017:27017"
    volumes:
      - ./data:/data/db
```
      

### Step 2: Start the Services
Run the following command to start both the app and MongoDB in detached mode:
```bash
docker-compose up -d
```

### Step 3: Stop the Running Services
```bash
docker-compose down
```

