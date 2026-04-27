const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const { createProxyMiddleware } = require('http-proxy-middleware');

require('dotenv').config();

const app = express();

const PORT = Number(process.env.PORT || 3443);
const SSL_CERT_PATH = '/etc/ssl/certs/server.crt';
const SSL_KEY_PATH = '/etc/ssl/certs/server.key';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
const RECIPES_SERVICE_URL = process.env.RECIPES_SERVICE_URL || 'http://recipes-service:3002';
const PROXY_CONNECT_TIMEOUT_MS = Number(process.env.PROXY_CONNECT_TIMEOUT_MS || 3000);
const PROXY_RESPONSE_TIMEOUT_MS = Number(process.env.PROXY_RESPONSE_TIMEOUT_MS || 5000);

const recipePrefixes = [
  '/recipes',
  '/pending/recipes',
  '/RecipeListView',
  '/pending/RecipeListView',
  '/Pending/RecipeListView',
];

function isRecipesRoute(pathname) {
  return recipePrefixes.some((prefix) => pathname.startsWith(prefix));
}

function getRouteTarget(pathname) {
  if (isRecipesRoute(pathname)) {
    return RECIPES_SERVICE_URL;
  }

  return AUTH_SERVICE_URL;
}

function stripApiPrefix(pathname) {
  return pathname.startsWith('/api') ? pathname.replace(/^\/api/, '') || '/' : pathname;
}

function createProxy(target) {
  return createProxyMiddleware({
    target,
    changeOrigin: false,
    secure: false,
    xfwd: true,
    timeout: PROXY_CONNECT_TIMEOUT_MS,
    proxyTimeout: PROXY_RESPONSE_TIMEOUT_MS,
    pathRewrite: (path, req) => stripApiPrefix(req.originalUrl || path),
    on: {
      error: (err, req, res) => {
        if (res.headersSent) {
          return;
        }

        return res.status(504).json({
          error: 'Upstream service unavailable or timeout',
          target,
          details: err?.message || 'proxy error',
          path: req.originalUrl || req.url,
        });
      },
    },
  });
}

app.set('trust proxy', 1);
app.use(cors());

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'api-gateway',
    targets: {
      auth: AUTH_SERVICE_URL,
      recipes: RECIPES_SERVICE_URL,
    },
  });
});

app.use('/uploads', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: false,
  secure: false,
  xfwd: true,
  timeout: PROXY_CONNECT_TIMEOUT_MS,
  proxyTimeout: PROXY_RESPONSE_TIMEOUT_MS,
  pathRewrite: (_path, req) => req.originalUrl,
  on: {
    error: (err, req, res) => {
      if (res.headersSent) {
        return;
      }

      return res.status(504).json({
        error: 'Upstream service unavailable or timeout',
        target: AUTH_SERVICE_URL,
        details: err?.message || 'proxy error',
        path: req.originalUrl || req.url,
      });
    },
  },
}));

const recipesProxy = createProxy(RECIPES_SERVICE_URL);
const authProxy = createProxy(AUTH_SERVICE_URL);

app.use(['/pending/recipes', '/pending/recipes/', '/pending/RecipeListView', '/Pending/RecipeListView', '/recipes', '/recipes/', '/RecipeListView'], recipesProxy);
app.use(['/api/recipes', '/api/recipes/', '/api/pending/recipes', '/api/pending/recipes/', '/api/RecipeListView', '/api/Pending/RecipeListView'], recipesProxy);
app.use(['/api', '/register', '/login', '/logout', '/auth', '/profile', '/users', '/recipes', '/pending', '/RecipeListView', '/Pending/RecipeListView'], authProxy);

function startHttpsServer() {
  if (!fs.existsSync(SSL_CERT_PATH) || !fs.existsSync(SSL_KEY_PATH)) {
    throw new Error(
      `HTTPS cert/key missing at ${SSL_CERT_PATH} and/or ${SSL_KEY_PATH}`,
    );
  }

  const tlsOptions = {
    cert: fs.readFileSync(SSL_CERT_PATH),
    key: fs.readFileSync(SSL_KEY_PATH),
  };

  https.createServer(tlsOptions, app).listen(PORT, () => {
    console.log(`API gateway listening on ${PORT}`);
  });
}

startHttpsServer();