FROM node:16-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json .
RUN npm install

# Copy source code
COPY . .

EXPOSE 3000

# Start Development Server
CMD [ "npm", "run", "start:dev" ]
