# Build stage
FROM node:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]