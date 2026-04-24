# build stage

FROM node:22-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build

# Production stage

FROM nginx:alpine

# remove default config (optional)
RUN rm -rf /etc/nginx/conf.d/default.conf

# copy custom nginx config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# copy built frontend
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]




