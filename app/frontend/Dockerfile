# Dockerfile for Frontend

# Step 1: Use Node 18 as the base image
FROM node:18

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json files to install dependencies
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the entire app to the container
COPY . .

# Step 6: Build the app for production
RUN npm run build

# Step 7: Install a static server to serve the production build
RUN npm install -g serve

# Step 8: Expose port 3000 (React's default port)
EXPOSE 3000

# Step 9: Serve the app
CMD ["serve", "-s", "dist", "-l", "3000"]
