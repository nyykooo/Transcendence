const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const axios = require('axios')

dotenv.config();

const app = express();
let currentId = 1;
app.use(express.json());

const users = [];

app.post('/register', async (req, res) => {
    const {email, password, name} = req.body;
    const user = users.find(r => r.email === email);

    if (!email || !password)
        return res.status(400).json({error: "Email and password required"});
    if (user)
        return res.status(409).json({error: "User already exists"});
    const passwordHash = await bcrypt.hash(password, 10);
    const newuser = {
        id: currentId,
        email: email,
        password: passwordHash,
        ...(name  ? { name } : {})
    }
    currentId++;
    users.push(newuser);
    const token = jwt.sign(
        {id: newuser.id, email: newuser.email},
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
    );

    return res.status(200).json({"message": "created user", newuser, token});
})


app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = users.find(r => r.email === email);
    if (!email || !password)
        return res.status(400).json({error: "Email and password required"});
    if (!user)
        return res.status(404).json({error: "Email is not registered"});
    const ok = await bcrypt.compare(password, user.password)
    if (!ok)
        return res.status(401).json({error: "Incorrect password"});
    const token = jwt.sign(
        {sub: user.id, email: user.email},
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
    );
    return res.status(200).json({"message": "Sucessful login", user, token});
})

function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token)
        return res.status(401).json({error: "Missing token"});
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    }
    catch(e) {
        return res.status(401).json({error: "invalid or expired token"});
    }

}

app.get('/profile', requireAuth, (req, res) => {
  res.json({ message: "ok", user: req.user });
})

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`Auth listening on ${PORT}`));

// Simple (training-only) global state store.
// NOTE: This is not safe for multi-user/concurrent logins in real apps.
let githubOAuthState = null;

app.get('/auth/github', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_CALLBACK_URL;

  if (!clientId || !redirectUri) {
    return res.status(500).json({
      error: "Missing GITHUB_CLIENT_ID or GITHUB_CALLBACK_URL",
    });
  }

  // FIX 1: Math.random() must be called
  githubOAuthState = Math.random().toString(36).slice(2);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri, // GitHub expects redirect_uri (underscore)
    scope: "user:email",
    state: githubOAuthState,
  });

  const githubAuthorizeUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
  return res.redirect(githubAuthorizeUrl);
});

app.get('/auth/github/callback', async (req, res) => {
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

    // Exchange code for access token
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
      };
      users.push(user);
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      { sub: user.id, email: user.email, githubId: user.githubId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "GitHub login successful",
      user,
      token: jwtToken,
    });
  } catch (error) {
    // FIX 2: use the catch variable name consistently
    return res.status(500).json({
      error: "GitHub OAuth failed",
      details: error?.response?.data || error.message,
    });
  }
});