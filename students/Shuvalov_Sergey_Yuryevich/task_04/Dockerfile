# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
COPY src/package*.json ./
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force

FROM node:20-alpine AS final
WORKDIR /app

RUN addgroup -g 10001 -S appgroup && \
    adduser -u 10001 -S appuser -G appgroup

COPY --from=deps --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --chown=appuser:appgroup src/ .

LABEL org.bstu.student.fullname="Shuvalov-Sergey-Yurevich" \
      org.bstu.student.id="220253" \
      org.bstu.group="feis-576" \
      org.bstu.variant="28" \
      org.bstu.course="RSIOT"

ENV PORT=9034 NODE_ENV=production

USER appuser

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:9034/live', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

EXPOSE 9034

CMD ["node", "server.js"]
