# =============================================================
# SITA S1 TI - Single Container Dockerfile
# Berisi: React (nginx) + Flask/gunicorn + supervisord
# =============================================================

# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install

COPY frontend/ .

ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# =============================================================
# Stage 2: Final image (Python + nginx + supervisord)
# =============================================================
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install nginx dan supervisor
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
WORKDIR /app/backend
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ .

# Copy hasil build frontend ke nginx html dir
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# nginx config: serve static + proxy /api/ ke gunicorn (localhost:8000)
RUN rm -f /etc/nginx/sites-enabled/default
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# supervisord config: jalankan nginx + gunicorn sekaligus
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]
