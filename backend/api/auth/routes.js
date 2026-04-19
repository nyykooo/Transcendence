const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const path = require('path')
const { pool } = require('../db');
const { requireAuth } = require('./requireAuth');
const { upload } = require('./upload');
const router = express.Router();
const DEFAULT_AVATAR = '/uploads/avatars/test.webp';

let currentId = 1;
const users = [];

router.post('/register', async (req, res) => {
  const {email, password, name} = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail || !password )
      return res.status(400).json({error: "email, password are required"});

    try {
    const passwordHash = await bcrypt.hash(password, 10);
    if (name)
    {
      
      const created = await pool.query(
        `INSERT INTO dev_dba.users (name, password, email, avatar, is_active, last_login)
        VALUES ($1, $2, $3, $4, false, NOW())
        RETURNING id, email, name, avatar, is_active, created_at, last_login`,
        [name, passwordHash, normalizedEmail, DEFAULT_AVATAR]
      );
      const newuser = { ...created.rows[0] };
      const token = jwt.sign(
        {id: newuser.id, email: newuser.email, avatar: newuser.avatar},
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
      );
      return res.status(200).json({message: "created user", newuser, token});
    } else {
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
    console.error('[register] unexpected error:', error);
    return res.status(500).json({error: "Failed to create user"});
  }
})


async function loginHandler(req,res) {
    const {email, password} = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!email || !password)
        return res.status(400).json({error: "Email and password required"});

  try {
    const result = await pool.query(
      `SELECT id, email, name, password, avatar, is_active, role
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
    console.error('[login] unexpected error:', error);
    return res.status(500).json({error: "Failed to login"});
  }
}

router.post(['/Login', '/login'], loginHandler);

router.put(['/profile'], requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({error: 'Unauthorized'});
    }
    
    const name = String(req.body?.name || '').trim();
    const normalizedEmail = String(req.body?.email || '').trim().toLowerCase();
    
    if (!name || !normalizedEmail) {
      return res.status(400).json({error: 'name and email required'});
    }

    const updated = await pool.query(
      ` UPDATE dev_dba.users
        SET name = $1, email = $2
        WHERE id = $3
        RETURNING id, email, name, avatar, is_active`,
        [name ,normalizedEmail, userId]
    );
    if (updated.rowCount === 0) {
      return res.status(404).json({error: 'User not found'});
    }
    return res.status(200).json({
      message: 'Profile updated',
      user: updated.rows[0],
    });
  }
  catch(error) {
    if (error?.code === '23505') {
      return res.status(409).json({error: 'Email already in use'});
    }
    console.error('[PUT /profile] unexpected error:', error);
    return res.status(500).json({error: 'Failed to update profile'});
  }
});

router.put(['/profile/password'], requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({error: 'Unauthorized'});
    }
    const result = await pool.query(
        `SELECT id, email, password , name, avatar, is_active
         FROM dev_dba.users
         WHERE id = $1
         LIMIT 1`,
        [userId]
      );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = result.rows[0];
    const currentPassword = String(req.body?.currentPassword || '');
    const newPassword = String(req.body?.newPassword || '');
    if (!newPassword || !currentPassword)
        return res.status(400).json({error: 'Password required'});
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok)
        return res.status(401).json({error: 'Current password is incorrect'});
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const updated = await pool.query(
      ` UPDATE dev_dba.users
        SET password = $1
        WHERE id = $2
        RETURNING id, email, name, avatar, is_active`,
        [passwordHash, userId]
    );
    if (updated.rowCount === 0) {
      return res.status(404).json({error: 'User not found'});
    }
    return res.status(200).json({
      message: 'Password updated',
      user: updated.rows[0],
    });
  } catch (error) {
    console.error('[PUT /profile/password] unexpected error:', error);
    return res.status(500).json({error: 'Failed to update password'});
  }
});

router.get(['/profile' ,'/auth'], requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await pool.query(
        `SELECT id, email, name, avatar, is_active
         FROM dev_dba.users
         WHERE id = $1
         LIMIT 1`,
        [userId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json({ message: 'ok', user: result.rows[0] });
    } catch (error) {
      console.error('[GET /profile] unexpected error:', error);
      return res.status(500).json({ error: 'Failed to load profile' });
    }
})

router.post('/profile/avatar', requireAuth, upload.single('avatar'), async (req, res) => {
    // This route will:
    const file = req.file;
    
    if (!file)
      return res.status(400).json({error: 'No file uploaded'});
    
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({error: 'Unauthorized'});
    
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${file.filename}`;

    try {
      const updated = await pool.query(
        `UPDATE dev_dba.users
        SET avatar = $1
        WHERE id = $2
        RETURNING id, email, name, avatar, is_active`,
       [avatarUrl, userId]
      );
      if (updated.rowCount === 0)
           return res.status(404).json({error: "User does not exist"});
      return res.status(200).json({
        message: 'Avatar updated',
        user: updated.rows[0],
        avatar: avatarUrl,
      });
    }

    catch (error)
    {
      console.error('[POST /profile/avatar] unexpected error:', error);
      return res.status(500).json({error: 'Failed to update avatar'});
    }
});


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

    const normalizedEmail = String(email || '').trim().toLowerCase();

    let user;
    const existing = await pool.query(
      `SELECT id, email, name, avatar, is_active
       FROM dev_dba.users
       WHERE lower(email) = $1
       LIMIT 1`,
      [normalizedEmail]
    );

    if (existing.rowCount > 0) {
      user = existing.rows[0];
    } else {
      const hashPass = await bcrypt.hash(ghUser.name || ghUser.login, 10);
      const created = await pool.query(
        `INSERT INTO dev_dba.users (name, password, email, avatar, is_active, last_login)
         VALUES ($1, $2, $3, $4, true, NOW())
         RETURNING id, email, name, avatar, is_active`,
        [ghUser.name || ghUser.login, hashPass, normalizedEmail, DEFAULT_AVATAR]
      );
      // git_id is not stored, but could be added to the users table if needed for future features
      user = created.rows[0];
    }
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email, githubId: user.githubId , avatar: user.avatar},
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  
    const frontendUrl = process.env.FRONTEND_URL || 'https://localhost:443';
    const redirectTo = new URL('/auth/github/callback', frontendUrl);
    redirectTo.searchParams.set('id', String(user.id));
    redirectTo.searchParams.set('token', jwtToken);
    return res.redirect(redirectTo.toString());
  } catch (error) {
    console.error('[GET /auth/github/callback] unexpected error:', error?.response?.data || error);
    return res.status(500).json({error: "GitHub OAuth failed"});
  }
});

module.exports = {authRouter: router, users};