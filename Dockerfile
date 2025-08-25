# ---- Build stage ----
FROM node:20-bullseye-slim AS build
WORKDIR /app
COPY package.json ./
COPY package-lock.json* ./
COPY yarn.lock* ./
COPY pnpm-lock.yaml* ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Runtime stage ----
FROM node:20-bullseye-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
ENV PORT=3000
ENV TEMPORAL_ADDRESS=temporal:7233
ENV TEMPORAL_TASK_QUEUE=hotel-orchestrator
ENV REDIS_URL=redis://redis:6379
EXPOSE 3000
CMD ["node", "dist/index.js"]