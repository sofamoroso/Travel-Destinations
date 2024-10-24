1. Insall Docker Desktop.

2. Check if both installed. (In terminal)
docker --version
docker-compose --version


Scenario 1 [Docker]
1. Create a Dockerfile with the following content:

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


2. In terminal, navigate to the directory where the Dockerfile is located and run the following commands:
# To build the image: 
docker buildx build -t travel-destinations-image .
# To run the container: 
docker run -d -p 3000:3000 --name travel-app travel-destinations-image
# To stop the container (can also be stopped inside Docker Desktop):
docker stop travel-app



Scenario 2 [Docker-Compose]
1. Create docker-compose.yml with the following content:

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
      

2. Run the following command to start both the app and MongoDB:
docker-compose up -d

3. To stop the running services, execute:
docker-compose down

