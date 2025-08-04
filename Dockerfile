# ---- STAGE 1: Build ----
FROM --platform=$BUILDPLATFORM node:18-alpine AS build
WORKDIR /app

# Copia file di lock e installa dipendenze (dev+prod) per avere Vite in build
COPY package.json package-lock.json ./
RUN npm ci

# Copia sorgenti e builda con Vite
COPY . .
RUN npm run build

# ---- STAGE 2: Runtime ----
FROM node:18-alpine AS runtime
WORKDIR /app

# Copia build statica e codice server
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server

# Copia package.json e lockfile per garantire npm ci in runtime
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./

# Installa solo dipendenze di produzione (Express, ecc.)
RUN npm ci --omit=dev

# Crea cartella dati per persistenza JSON
RUN mkdir -p /app/data

# Esponi porta 3001 per API e UI
EXPOSE 3001

# Avvia il server Express che serve API e UI
CMD ["node", "server/index.js"]
