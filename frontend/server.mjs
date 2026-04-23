import fs from 'node:fs/promises';
import path from 'node:path';
import https from 'node:https';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const isProd = process.env.NODE_ENV === 'production';
const root = process.cwd();
const port = Number(process.env.PORT || 443);
const certPath = process.env.SSL_CERT_PATH || '/etc/ssl/certs/server.crt';
const keyPath = process.env.SSL_KEY_PATH || '/etc/ssl/certs/server.key';
const apiTarget = process.env.FRONTEND_API_TARGET || (isProd ? 'https://api:3443' : 'https://localhost:3443');

async function createServer() {
  const app = express();

  // Keep parity with the previous nginx behavior: /api/* and /uploads/* must hit backend.
  app.get('/api', (_req, res) => {
    res.redirect(301, '/api/');
  });

  app.use(
    '/api',
    createProxyMiddleware({
      target: apiTarget,
      changeOrigin: true,
      secure: false,
      pathRewrite: (path) => `/api${path}`,
      xfwd: true,
    })
  );

  app.use(
    '/uploads',
    createProxyMiddleware({
      target: apiTarget,
      changeOrigin: true,
      secure: false,
      pathRewrite: (path) => `/uploads${path}`,
      xfwd: true,
    })
  );

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root,
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use(async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const template = await fs.readFile(path.resolve(root, 'index.html'), 'utf-8');
        const transformedTemplate = await vite.transformIndexHtml(url, template);
        const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');
        const appHtml = render(url);
        const html = transformedTemplate.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (error) {
        vite.ssrFixStacktrace(error);
        next(error);
      }
    });
  } else {
    const distClient = path.resolve(root, 'dist/client');
    const template = await fs.readFile(path.join(distClient, 'index.html'), 'utf-8');

    app.use('/assets', express.static(path.join(distClient, 'assets')));
    app.use(express.static(distClient, { index: false }));

    app.use(async (req, res) => {
      const { render } = await import('./dist/server/entry-server.js');
      const appHtml = render(req.originalUrl);
      const html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    });
  }

  if (isProd) {
    try {
      const [cert, key] = await Promise.all([
        fs.readFile(certPath),
        fs.readFile(keyPath),
      ]);
      https.createServer({ cert, key }, app).listen(port, () => {
        console.log(`SSR frontend HTTPS server listening on ${port}`);
      });
      return;
    } catch {
      console.warn('SSL cert/key not found for frontend SSR; falling back to HTTP');
    }
  }

  app.listen(port, () => {
    console.log(`SSR frontend HTTP server listening on ${port}`);
  });
}

createServer();
