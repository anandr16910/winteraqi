# Stage 1: Build the Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup Backend & Serve Frontend
FROM node:20-slim
WORKDIR /app
COPY backend/package*.json ./backend/
RUN npm --prefix backend install --omit=dev
COPY backend/ ./backend/

Copy built frontend assets into backend public/dist folder
COPY --from=frontend-builder /app/frontend/dist ./backend/public

ENV NODE_ENV=production
ENV API_BACKEND_PORT=8080
EXPOSE 8080

CMD ["node", "backend/server.js"]