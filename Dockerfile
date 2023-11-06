# ---- Build Stage ----
FROM node:18 AS build-stage
WORKDIR /api
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

# ---- Release Stage ----
FROM node:18 AS release-stage
WORKDIR /api

# Copying necessary files from the build stage
COPY --from=build-stage /api/node_modules ./node_modules
COPY --from=build-stage /api/dist ./dist
EXPOSE 8080
CMD ["node", "./dist/src/server.js"]