# Script NPM da aggiungere al package.json

Per far funzionare l'applicazione in produzione con file storage, aggiungi questi script al `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development", 
    "lint": "eslint .",
    "preview": "vite preview",
    "start:server": "node server/index.js",
    "start:prod": "npm run start:server & npm run preview",
    "docker:build": "docker build -t trattoria-menu .",
    "docker:run": "docker run -p 8080:8080 -p 3001:3001 -v $(pwd)/data:/app/data trattoria-menu"
  }
}
```

## Come usarli:

- `npm run start:server` - Avvia solo il server Express sulla porta 3001
- `npm run start:prod` - Avvia server + frontend per produzione 
- `npm run docker:build` - Costruisce l'immagine Docker
- `npm run docker:run` - Avvia il container Docker con volume per persistenza

## Note:
- Il server Express salverà i dati in file JSON nella cartella `data/`
- I file saranno: `data/users.json`, `data/current_user.json`, `data/dishes.json`
- In Docker, i dati saranno persistenti grazie al volume mount