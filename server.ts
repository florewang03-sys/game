import express from 'express';
import { createServer as createViteServer } from 'vite';
import syncHandler from './api/sync';

const app = express();
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

const PORT = 3000;

// Route de synchronisation centrale en temps réel
app.all('/api/sync', (req, res) => {
  syncHandler(req, res);
});

async function start() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server ready on port ${PORT}`);
  });
}

start();
