const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const path = require('path')
const { pool } = require('../db');
const { requireAuth } = require('./requireAuth');
const { upload } = require('./upload');
const router = express.Router();

let currentId = 1;
const users = [];

router.post('/register', async (req, res) => {
  const {email, password, name} = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail || !password || !name)
      return res.status(400).json({error: "email, password, and name are required"});

    try {
    const passwordHash = await bcrypt.hash(password, 10);
    if (name)
    {
      
      const created = await pool.query(
        `INSERT INTO dev_dba.users (name, password, email, is_active, last_login)
        VALUES ($1, $2, $3, false, NOW())
        RETURNING id, email, name, is_active, created_at, last_login`,
        [name, passwordHash, normalizedEmail]
      );
      const newuser = { ...created.rows[0], avatar: null };
      const token = jwt.sign(
        {id: newuser.id, email: newuser.email, avatar: newuser.avatar},
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
      );
      return res.status(200).json({message: "created user", newuser, token});
    } else {

    const created = await pool.query(
        `INSERT INTO dev_dba.users (password, email, is_active, last_login)
        VALUES ($1, false, NOW())
        RETURNING  name, is_active, created_at, last_login`,
        [ passwordHash, normalizedEmail]
      );
      const newuser = { ...created.rows[0], avatar: null };
      const token = jwt.sign(
        {id: newuser.id, email: newuser.email, avatar: newuser.avatar},
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
      );
      return res.status(200).json({message: "created user", newuser, token});
    }
  } catch (error) {
    if (error?.code === '23505')
      return res.status(409).json({error: "User already exists"});
    return res.status(500).json({error: "Failed to create user", details: error.message});
  }
})


async function loginHandler(req,res) {
    const {email, password} = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!email || !password)
        return res.status(400).json({error: "Email and password required"});

  try {
    const result = await pool.query(
      `SELECT id, email, name, password, is_active
       FROM dev_dba.users
       WHERE lower(email) = $1
       LIMIT 1`,
      [normalizedEmail]
    );

    if (result.rowCount === 0)
      return res.status(404).json({error: "Email is not registered"});

    const user = result.rows[0];

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(401).json({error: "Incorrect password"});

    await pool.query('UPDATE dev_dba.users SET last_login = NOW(), is_active = true WHERE id = $1', [user.id]);

    const token = jwt.sign(
      {id: user.id, email: user.email, avatar: user.avatar},
      process.env.JWT_SECRET,
      {expiresIn: "1h"}
    );
    return res.status(200).json({message: "Sucessful login", id: user.id, token});

  } catch (error) {
    
    return res.status(500).json({error: "Failed to login", details: error.message});
  }
}

router.post(['/Login', '/login'], loginHandler);


router.get(['/profile' ,'/auth'], requireAuth, (req, res) => {
    res.json({message: 'ok', user: req.user})
})


router.post('/profile/avatar', requireAuth, upload.single('avatar'), async (req, res) => {
    // This route will:
    const file = req.file;
    // 1. Check if a file was uploaded
    if (!file)
      return res.status(400).json({error: 'No file uploaded'});
    // 3. Save the avatar URL to the user object
  const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${file.filename}`;
  // 4. Return the avatar URL
  return res.status(200).json({ avatar: avatarUrl });
})
;


// Simple (training-only) global state store.
// NOTE: This is not safe for multi-user/concurrent logins in real apps.
let githubOAuthState = null;

router.get('/auth/github', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_CALLBACK_URL;

  if (!clientId || !redirectUri) {
    return res.status(500).json({
      error: "Missing GITHUB_CLIENT_ID or GITHUB_CALLBACK_URL",
    });
  }

  githubOAuthState = Math.random().toString(36).slice(2);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "user:email",
    state: githubOAuthState,
  });

  const githubAuthorizeUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
  return res.redirect(githubAuthorizeUrl);
});

router.get('/auth/github/callback', async (req, res) => {
  try {
    // If GitHub sends an error instead of a code, surface it
    if (req.query.error) {
      return res.status(400).json({
        error: "GitHub OAuth error",
        details: {
          error: req.query.error,
          error_description: req.query.error_description,
        },
      });
    }

    const code = req.query.code;
    const returnedState = req.query.state;

    if (!code) return res.status(400).json({ error: "Missing code" });

    if (!returnedState || !githubOAuthState || returnedState !== githubOAuthState) {
      return res.status(401).json({ error: "Invalid state" });
    }
    githubOAuthState = null; // basic replay protection

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const redirectUri = process.env.GITHUB_CALLBACK_URL;

    if (!clientId || !clientSecret || !redirectUri) {
      return res.status(500).json({
        error: "Missing GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, or GITHUB_CALLBACK_URL",
      });
    }

    
    const tokenResp = await axios.post(
      "https://github.com/login/oauth/access_token",
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: String(code),
        redirect_uri: redirectUri,
      }).toString(),
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResp.data?.access_token;
    if (!accessToken) {
      return res.status(401).json({
        error: "No access token from GitHub",
        details: tokenResp.data,
      });
    }

    // Fetch GitHub user
    const ghUserResp = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    const ghUser = ghUserResp.data;
    if (!ghUser?.id) {
      return res.status(500).json({ error: "Invalid GitHub user response" });
    }

    // Fetch emails and pick primary verified
    const emailResp = await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    const emails = Array.isArray(emailResp.data) ? emailResp.data : [];
    const primaryVerified = emails.find(e => e.primary && e.verified);
    const anyVerified = emails.find(e => e.verified);
    const email = primaryVerified?.email || anyVerified?.email || ghUser.email;

    if (!email) {
      return res.status(400).json({ error: "No verified email available from GitHub" });
    }

    // Find or create local user using GitHub ID
    let user = users.find(u => u.githubId === ghUser.id);
    if (!user) {
      user = {
        id: currentId++,
        githubId: ghUser.id,
        email,
        name: ghUser.name || ghUser.login,
        password: null,
        avatar: null,
      };
      const hash_pass = bcrypt.hash(user.name, 10);
     const created = await pool.query(
      `INSERT INTO dev_dba.users (name, password, email, is_active, last_login)
       VALUES ($1, $2, $3, true, NOW())
       RETURNING id, email, name, is_active, created_at, last_login`,
      [user.name, user.name, hash_pass, user.email]
    );
    users.push(user);
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email, githubId: user.githubId , avatar: user.avatar},
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:80';
    const redirectTo = new URL('/auth/github/callback', frontendUrl);
    redirectTo.searchParams.set('id', String(user.id));
    redirectTo.searchParams.set('token', jwtToken);
    return res.redirect(redirectTo.toString());
  } catch (error) {
    return res.status(500).json({
      error: "GitHub OAuth failed",
      details: error?.response?.data || error.message,
    });
  }
});

module.exports = {authRouter: router, users};