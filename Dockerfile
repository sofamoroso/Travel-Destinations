# Dockerfile
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

# Command to start your app
CMD ["npm", "start"]


# In terminal, navigate to the directory where the Dockerfile is located and run the following commands:

# To build the image: docker buildx build -t travel-destinations-image .
# To run the container: docker run -d -p 3000:3000 --name travel-app travel-destinations-image
