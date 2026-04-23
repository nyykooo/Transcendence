const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const path = require('path')
const fs = require('fs').promises;
const { pool } = require('../db');
const { requireAuth, requireAuthWithRateLimit } = require('./requireAuth');
const { upload, removeFileIfExists, uploadDir } = require('./upload');
const { generateTotpSecret, buildQrCodeDataUrl, verifyTotpToken } = require('./twoFactorService');
const { validateRecipes, parseCSV, parseJSON } = require('./importExport');
const router = express.Router();

const DEFAULT_AVATAR = '/uploads/avatars/test.webp';

function normalizeFriendEmail(value) {
  return String(value || '').trim().toLowerCase();
}

async function loadUserFriends(userId) {
  const ownerResult = await pool.query(
    `SELECT friend_list
     FROM dev_dba.users
     WHERE id = $1
     LIMIT 1`,
    [userId]
  );

  if (ownerResult.rowCount === 0) {
    return null;
  }

  const rawFriends = Array.isArray(ownerResult.rows[0].friend_list)
    ? ownerResult.rows[0].friend_list
    : [];
  const normalizedFriends = rawFriends
    .map((email) => normalizeFriendEmail(email))
    .filter(Boolean);

  if (normalizedFriends.length === 0) {
    return [];
  }

  const friendsResult = await pool.query(
    `SELECT id, name, email, avatar, is_active
     FROM dev_dba.users
     WHERE lower(email) = ANY($1::text[])
     ORDER BY name ASC`,
    [normalizedFriends]
  );

  return friendsResult.rows;
}

async function loadUserFriendRequests(userId) {
  const ownerResult = await pool.query(
    `SELECT request_list
     FROM dev_dba.users
     WHERE id = $1
     LIMIT 1`,
    [userId]
  );

  if (ownerResult.rowCount === 0) {
    return null;
  }

  const rawRequests = Array.isArray(ownerResult.rows[0].request_list)
    ? ownerResult.rows[0].request_list
    : [];
  const normalizedRequests = rawRequests
    .map((email) => normalizeFriendEmail(email))
    .filter(Boolean);

  if (normalizedRequests.length === 0) {
    return [];
  }

  const requestsResult = await pool.query(
    `SELECT id, name, email, avatar, is_active
     FROM dev_dba.users
     WHERE lower(email) = ANY($1::text[])
     ORDER BY name ASC`,
    [normalizedRequests]
  );

  return requestsResult.rows;
}

let currentId = 1;
const users = [];

router.post('/register', async (req, res) => {
  const {email, password, name} = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedName = String(name || '').trim();

    if (!normalizedEmail || !password )
      return res.status(400).json({error: "email, password are required"});

    if (!normalizedName)
      return res.status(400).json({error: "name is required"});

    try {
    const passwordHash = await bcrypt.hash(password, 10);
    const created = await pool.query(
      `INSERT INTO dev_dba.users (name, password, email, avatar, is_active, last_login)
      VALUES ($1, $2, $3, $4, false, NOW())
      RETURNING id, email, name, avatar, is_active, created_at, last_login, role`,
      [normalizedName, passwordHash, normalizedEmail, DEFAULT_AVATAR]
    );

    const newuser = { ...created.rows[0] };
    const token = jwt.sign(
      {id: newuser.id, email: newuser.email, avatar: newuser.avatar, role: newuser.role},
      process.env.JWT_SECRET,
      {expiresIn: "1h"}
    );

    return res.status(200).json({message: "created user", newuser, token});
  } catch (error) {
    if (error?.code === '23505')
      return res.status(409).json({error: "User already exists"});
    console.log('[register] unexpected error:', error);
    return res.status(500).json({error: "Failed to create user"});
  }
})


async function loginHandler(req, res) {
  const { email, password } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const result = await pool.query(
      `SELECT id, email, name, password, avatar, is_active, role, two_factor_enabled, two_factor_secret
       FROM dev_dba.users
       WHERE lower(email) = $1
       LIMIT 1`,
      [normalizedEmail]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Email is not registered' });
    }

    const user = result.rows[0];

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const requires2fa = Boolean(user.two_factor_enabled && user.two_factor_secret);

    if (requires2fa) {
      const twoFactorToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          purpose: '2fa_pending',
        },
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
      );

      return res.status(200).json({
        message: '2FA required',
        requires2fa: true,
        twoFactorToken,
        id: user.id,
        role: user.role,
      });
    }

    await pool.query(
      'UPDATE dev_dba.users SET last_login = NOW(), is_active = true WHERE id = $1',
      [user.id]
    );

    const token = jwt.sign(
      { id: user.id, email: user.email, avatar: user.avatar, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Sucessful login',
      id: user.id,
      token,
      role: user.role,
      requires2fa: false,
    });
  } catch (error) {
    console.log('[login] unexpected error:', error);
    return res.status(500).json({ error: 'Failed to login' });
  }
}

router.post(['/Login', '/login'], loginHandler);

router.put(['/Logout', '/logout'], requireAuthWithRateLimit, async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({error: 'Unauthorized'});
  }
  await pool.query(
    `UPDATE dev_dba.users
     SET is_active = false
     WHERE id = $1`,
    [userId]
  );
  return res.status(200).json({message: 'Logged out successfully'});
});

async function completeTwoFactorLoginHandler(req, res) {
  try {
    const twoFactorToken = String(req.body?.twoFactorToken || '').trim();
    const otp = String(req.body?.otp || req.body?.token || '').trim();

    if (!twoFactorToken || !otp) {
      return res.status(400).json({ error: 'twoFactorToken and otp are required' });
    }

    let pending;
    try {
      pending = jwt.verify(twoFactorToken, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Invalid or expired 2FA token' });
    }

    if (pending?.purpose !== '2fa_pending' || !pending?.id) {
      return res.status(401).json({ error: 'Invalid 2FA token payload' });
    }

    const result = await pool.query(
      `SELECT id, email, avatar, role, two_factor_enabled, two_factor_secret
       FROM dev_dba.users
       WHERE id = $1
       LIMIT 1`,
      [pending.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    if (!user.two_factor_enabled || !user.two_factor_secret) {
      return res.status(400).json({ error: '2FA is not enabled for this user' });
    }

    const isValid = verifyTotpToken({
      secret: user.two_factor_secret,
      token: otp,
    });

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid OTP code' });
    }

    await pool.query(
      'UPDATE dev_dba.users SET last_login = NOW(), is_active = true WHERE id = $1',
      [user.id]
    );

    const token = jwt.sign(
      { id: user.id, email: user.email, avatar: user.avatar, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Sucessful login',
      id: user.id,
      token,
      role: user.role,
      requires2fa: false,
    });
  } catch (error) {
    console.error('[POST /login/2fa] unexpected error:', error);
    return res.status(500).json({ error: 'Failed to complete 2FA login' });
  }
}

router.post(['/Login/2fa', '/login/2fa'], completeTwoFactorLoginHandler);


function toAvatarDiskPath(avatarValue) {
  if (!avatarValue || avatarValue === DEFAULT_AVATAR) return null;

  let pathname = '';
  try {
    // Works for absolute URL and relative path
    pathname = new URL(String(avatarValue), 'http://local').pathname;
  } catch {
    return null;
  }

  const prefix = '/uploads/avatars/';
  if (!pathname.startsWith(prefix)) return null;

  const fileName = path.basename(pathname); // strips traversal attempts
  if (!fileName || fileName === 'test.webp') return null;

  // uploadDir resolves inside backend/services/auth-service/uploads/avatars
  const absolutePath = path.resolve(uploadDir, fileName);
  const avatarsRoot = path.resolve(uploadDir) + path.sep;

  // Final safety check: must stay inside avatars folder
  if (!absolutePath.startsWith(avatarsRoot)) return null;

  return absolutePath;
}

async function deleteAvatarHandler(req, res){
  try {
    const userId = req.userId ?? req.user?.id;
    if (!userId) {
      return res.status(401).json({error: 'Unauthorized'});
    }
    const search = await pool.query(
      ` SELECT avatar
        FROM dev_dba.users
        WHERE id = $1`,
        [userId]
    );
    if (search.rowCount === 0) {
      return res.status(404).json({error: 'User not found'});
    }
    const currentAvatar = search.rows[0].avatar;
    if (currentAvatar === DEFAULT_AVATAR)
      return res.status(400).json({error: 'No custom avatar to delete'});

    const avatarDiskPath = toAvatarDiskPath(currentAvatar);
    
    const updated = await pool.query(
      `UPDATE dev_dba.users
      SET avatar = $1
      WHERE id = $2
      RETURNING id, email, name, avatar, role, is_active`,
      [DEFAULT_AVATAR, userId]
    );
    if (updated.rowCount === 0) {
      return res.status(404).json({error: 'User not found'});
    }
    if (avatarDiskPath) {
      await removeFileIfExists(avatarDiskPath);
    }

    return res.status(200).json({
      message: 'Avatar deleted',
      user: updated.rows[0],
    });
  }
  catch (error) {
   console.error('[DELETE /profile/avatar] unexpected error:', error);
    return res.status(500).json({error: 'Failed to delete avatar'});
  }
}


router.delete('/profile/avatar', requireAuth, deleteAvatarHandler);

router.put(['/profile'], requireAuthWithRateLimit, async (req, res) => {
  try {
    const userId = req.userId ?? req.user?.id;
    if (!userId) {
      return res.status(401).json({error: 'Unauthorized'});
    }
    
    const name = String(req.body?.name || '').trim();
    const normalizedEmail = String(req.body?.email || '').trim().toLowerCase();
    
    if (!name || !normalizedEmail) {
      return res.status(400).json({error: 'name and email required'});
    }
    const result = await pool.query(
        `SELECT id, email, password , name, avatar, is_active, git_id
         FROM dev_dba.users
         WHERE id = $1
         LIMIT 1`,
        [userId]
      );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = result.rows[0];
    if (user.git_id)
      return res.status(400).json({error: 'Profile cannot be changed for users registered via GitHub OAuth'});

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
    console.log('[PUT /profile] unexpected error:', error);
    return res.status(500).json({error: 'Failed to update profile'});
  }
});

router.put(['/profile/password'], requireAuthWithRateLimit, async (req, res) => {
  try {
    const userId = req.userId ?? req.user?.id;
    if (!userId) {
      return res.status(401).json({error: 'Unauthorized'});
    }
    const result = await pool.query(
        `SELECT id, email, password , name, avatar, is_active, git_id
         FROM dev_dba.users
         WHERE id = $1
         LIMIT 1`,
        [userId]
      );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = result.rows[0];
    if (user.git_id)
      return res.status(400).json({error: 'Password cannot be changed for users registered via GitHub OAuth'});
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
    console.log('[PUT /profile/password] unexpected error:', error);
    return res.status(500).json({error: 'Failed to update password'});
  }
});

router.get(['/profile' ,'/auth'], requireAuthWithRateLimit, async (req, res) => {
    try {
      const userId = req.userId ?? req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await pool.query(
        `SELECT id, email, name, avatar, is_active, role, two_factor_enabled
         FROM dev_dba.users
         WHERE id = $1
         LIMIT 1`,
        [userId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const friends = await loadUserFriends(userId);
      if (friends === null) {
        return res.status(404).json({ error: 'User not found' });
      }

      const friendRequests = await loadUserFriendRequests(userId);
      if (friendRequests === null) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json({
        message: 'ok',
        user: {
          ...result.rows[0],
          friends,
          friendRequests,
        },
      });
    } catch (error) {
      console.log('[GET /profile] unexpected error:', error);
      return res.status(500).json({ error: 'Failed to load profile' });
    }
})

router.get('/profile/friends', requireAuthWithRateLimit, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const friends = await loadUserFriends(userId);
    if (friends === null) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'Friends loaded', friends });
  } catch (error) {
    console.error('[GET /profile/friends] unexpected error:', error);
    return res.status(500).json({ error: 'Failed to load friends' });
  }
});

router.post('/profile/friends', requireAuthWithRateLimit, async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const targetName = String(req.body?.name || '').trim().toLowerCase();
    if (!targetName) {
      return res.status(400).json({ error: 'Friend name is required' });
    }

    await client.query('BEGIN');

    const requesterResult = await client.query(
      `SELECT id, email, name, friend_list, request_list
       FROM dev_dba.users
       WHERE id = $1
       LIMIT 1
       FOR UPDATE`,
      [userId]
    );

    if (requesterResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'User not found' });
    }

    const requesterEmail = normalizeFriendEmail(requesterResult.rows[0].email);

    const targetResult = await client.query(
      `SELECT id, email, name, friend_list, request_list
       FROM dev_dba.users
       WHERE lower(name) = $1
       LIMIT 1
       FOR UPDATE`,
      [targetName]
    );

    if (targetResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Friend user not found' });
    }

    const friendId = targetResult.rows[0].id;
    if (friendId === userId) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'You cannot add yourself as a friend' });
    }
    const friendEmail = normalizeFriendEmail(targetResult.rows[0].email);

    const requesterFriendList = Array.isArray(requesterResult.rows[0].friend_list)
      ? requesterResult.rows[0].friend_list.map((email) => normalizeFriendEmail(email))
      : [];
    const targetFriendList = Array.isArray(targetResult.rows[0].friend_list)
      ? targetResult.rows[0].friend_list.map((email) => normalizeFriendEmail(email))
      : [];

    if (requesterFriendList.includes(friendEmail) || targetFriendList.includes(requesterEmail)) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'You are already friends' });
    }

    const requesterIncoming = Array.isArray(requesterResult.rows[0].request_list)
      ? requesterResult.rows[0].request_list.map((email) => normalizeFriendEmail(email))
      : [];
    if (requesterIncoming.includes(friendEmail)) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'This user already sent you a friend request. Accept it from your requests list.' });
    }

    const targetIncoming = Array.isArray(targetResult.rows[0].request_list)
      ? targetResult.rows[0].request_list.map((email) => normalizeFriendEmail(email))
      : [];
    if (targetIncoming.includes(requesterEmail)) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Friend request already sent' });
    }

    await client.query(
      `UPDATE dev_dba.users
       SET request_list = CASE
         WHEN $2 = ANY(COALESCE(request_list, '{}'::text[])) THEN COALESCE(request_list, '{}'::text[])
         ELSE array_append(COALESCE(request_list, '{}'::text[]), $2)
       END
       WHERE id = $1`,
      [friendId, requesterEmail]
    );

    await client.query('COMMIT');

    const profileResult = await pool.query(
      `SELECT id, email, name, avatar, is_active, role, two_factor_enabled
       FROM dev_dba.users
       WHERE id = $1
       LIMIT 1`,
      [userId]
    );
    const friends = await loadUserFriends(userId);
    const friendRequests = await loadUserFriendRequests(userId);

    return res.status(200).json({
      message: 'Friend request sent',
      user: {
        ...profileResult.rows[0],
        friends: friends || [],
        friendRequests: friendRequests || [],
      },
    });
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {}
    console.error('[POST /profile/friends] unexpected error:', error);
    return res.status(500).json({ error: 'Failed to send friend request' });
  } finally {
    client.release();
  }
});

router.get('/profile/friends/requests', requireAuthWithRateLimit, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const requests = await loadUserFriendRequests(userId);
    if (requests === null) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'Friend requests loaded', requests });
  } catch (error) {
    console.error('[GET /profile/friends/requests] unexpected error:', error);
    return res.status(500).json({ error: 'Failed to load friend requests' });
  }
});

router.post('/profile/friends/requests/accept', requireAuthWithRateLimit, async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const requesterEmailFromBody = normalizeFriendEmail(req.body?.email);
    if (!requesterEmailFromBody) {
      return res.status(400).json({ error: 'Requester email is required' });
    }

    await client.query('BEGIN');

    const currentUserResult = await client.query(
      `SELECT id, email, friend_list, request_list
       FROM dev_dba.users
       WHERE id = $1
       LIMIT 1
       FOR UPDATE`,
      [userId]
    );

    if (currentUserResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'User not found' });
    }

    const currentUserEmail = normalizeFriendEmail(currentUserResult.rows[0].email);
    if (requesterEmailFromBody === currentUserEmail) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'You cannot accept your own request' });
    }

    const requesterResult = await client.query(
      `SELECT id, email, friend_list
       FROM dev_dba.users
       WHERE lower(email) = $1
       LIMIT 1
       FOR UPDATE`,
      [requesterEmailFromBody]
    );

    if (requesterResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Requester user not found' });
    }

    const requesterId = requesterResult.rows[0].id;
    const requesterEmail = normalizeFriendEmail(requesterResult.rows[0].email);

    const currentUserRequests = Array.isArray(currentUserResult.rows[0].request_list)
      ? currentUserResult.rows[0].request_list.map((email) => normalizeFriendEmail(email))
      : [];

    if (!currentUserRequests.includes(requesterEmail)) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'No pending friend request from this user' });
    }

    await client.query(
      `UPDATE dev_dba.users
       SET request_list = array_remove(COALESCE(request_list, '{}'::text[]), $2),
           friend_list = CASE
             WHEN $2 = ANY(COALESCE(friend_list, '{}'::text[])) THEN COALESCE(friend_list, '{}'::text[])
             ELSE array_append(COALESCE(friend_list, '{}'::text[]), $2)
           END
       WHERE id = $1`,
      [userId, requesterEmail]
    );

    await client.query(
      `UPDATE dev_dba.users
       SET friend_list = CASE
         WHEN $2 = ANY(COALESCE(friend_list, '{}'::text[])) THEN COALESCE(friend_list, '{}'::text[])
         ELSE array_append(COALESCE(friend_list, '{}'::text[]), $2)
       END
       WHERE id = $1`,
      [requesterId, currentUserEmail]
    );

    await client.query('COMMIT');

    const profileResult = await pool.query(
      `SELECT id, email, name, avatar, is_active, role, two_factor_enabled
       FROM dev_dba.users
       WHERE id = $1
       LIMIT 1`,
      [userId]
    );
    const friends = await loadUserFriends(userId);
    const friendRequests = await loadUserFriendRequests(userId);

    return res.status(200).json({
      message: 'Friend request accepted',
      user: {
        ...profileResult.rows[0],
        friends: friends || [],
        friendRequests: friendRequests || [],
      },
    });
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {}
    console.error('[POST /profile/friends/requests/accept] unexpected error:', error);
    return res.status(500).json({ error: 'Failed to accept friend request' });
  } finally {
    client.release();
  }
});

router.delete('/profile/friends/requests', requireAuthWithRateLimit, async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const requesterEmailFromBody = normalizeFriendEmail(req.body?.email);
    if (!requesterEmailFromBody) {
      return res.status(400).json({ error: 'Requester email is required' });
    }

    await client.query('BEGIN');

    const currentUserResult = await client.query(
      `SELECT id, email, request_list
       FROM dev_dba.users
       WHERE id = $1
       LIMIT 1
       FOR UPDATE`,
      [userId]
    );

    if (currentUserResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'User not found' });
    }

    const currentUserEmail = normalizeFriendEmail(currentUserResult.rows[0].email);
    if (requesterEmailFromBody === currentUserEmail) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Invalid requester email' });
    }

    await client.query(
      `UPDATE dev_dba.users
       SET request_list = array_remove(COALESCE(request_list, '{}'::text[]), $2)
       WHERE id = $1`,
      [userId, requesterEmailFromBody]
    );

    await client.query('COMMIT');

    const profileResult = await pool.query(
      `SELECT id, email, name, avatar, is_active, role, two_factor_enabled
       FROM dev_dba.users
       WHERE id = $1
       LIMIT 1`,
      [userId]
    );
    const friends = await loadUserFriends(userId);
    const friendRequests = await loadUserFriendRequests(userId);

    return res.status(200).json({
      message: 'Friend request removed',
      user: {
        ...profileResult.rows[0],
        friends: friends || [],
        friendRequests: friendRequests || [],
      },
    });
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {}
    console.error('[DELETE /profile/friends/requests] unexpected error:', error);
    return res.status(500).json({ error: 'Failed to remove friend request' });
  } finally {
    client.release();
  }
});

router.delete('/profile/friends', requireAuthWithRateLimit, async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const targetEmail = normalizeFriendEmail(req.body?.email);
    if (!targetEmail) {
      return res.status(400).json({ error: 'Friend email is required' });
    }

    await client.query('BEGIN');

    const requesterResult = await client.query(
      `SELECT id, email
       FROM dev_dba.users
       WHERE id = $1
       LIMIT 1
       FOR UPDATE`,
      [userId]
    );

    if (requesterResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'User not found' });
    }

    const requesterEmail = normalizeFriendEmail(requesterResult.rows[0].email);
    if (targetEmail === requesterEmail) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'You cannot remove yourself' });
    }

    const targetResult = await client.query(
      `SELECT id, email
       FROM dev_dba.users
       WHERE lower(email) = $1
       LIMIT 1
       FOR UPDATE`,
      [targetEmail]
    );

    if (targetResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Friend user not found' });
    }

    const friendId = targetResult.rows[0].id;
    const friendEmail = normalizeFriendEmail(targetResult.rows[0].email);

    await client.query(
      `UPDATE dev_dba.users
       SET friend_list = array_remove(COALESCE(friend_list, '{}'::text[]), $2)
       WHERE id = $1`,
      [userId, friendEmail]
    );

    await client.query(
      `UPDATE dev_dba.users
       SET friend_list = array_remove(COALESCE(friend_list, '{}'::text[]), $2)
       WHERE id = $1`,
      [friendId, requesterEmail]
    );

    await client.query('COMMIT');

    const profileResult = await pool.query(
      `SELECT id, email, name, avatar, is_active, role, two_factor_enabled
       FROM dev_dba.users
       WHERE id = $1
       LIMIT 1`,
      [userId]
    );
    const friends = await loadUserFriends(userId);

    return res.status(200).json({
      message: 'Friend removed',
      user: {
        ...profileResult.rows[0],
        friends: friends || [],
      },
    });
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {}
    console.error('[DELETE /profile/friends] unexpected error:', error);
    return res.status(500).json({ error: 'Failed to remove friend' });
  } finally {
    client.release();
  }
});

router.post('/profile/avatar', requireAuthWithRateLimit, upload.single('avatar'), async (req, res) => {
    // This route will:
    const file = req.file;
    
    if (!file)
      return res.status(400).json({error: 'No file uploaded'});
    
    const userId = req.userId ?? req.user?.id;
    if (!userId)
      return res.status(401).json({error: 'Unauthorized'});
    
    const avatarUrl = `/uploads/avatars/${file.filename}`;

    try {

      const search = await pool.query(
        ` SELECT avatar
          FROM dev_dba.users
          WHERE id = $1`,
          [userId]
      );
      if (search.rowCount === 0)
        return res.status(404).json({error: 'User not found'});
      
      const currentAvatar = search.rows[0].avatar;
      if (currentAvatar && currentAvatar !== DEFAULT_AVATAR) {
        const avatarDiskPath = toAvatarDiskPath(currentAvatar);
        if (avatarDiskPath) {
          await removeFileIfExists(avatarDiskPath);
        }
      }
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
      console.log('[POST /profile/avatar] unexpected error:', error);
      return res.status(500).json({error: 'Failed to update avatar'});
    }
});

async function setupTwoFactorHandler(req, res) {
  try {
    const userId = req.userId ?? req.user?.id;
    if (!userId) {
      return res.status(401).json({error: 'Unauthorized'});
    }
    const userResult = await pool.query (
      `SELECT id, email, two_factor_enabled, git_id
      FROM dev_dba.users
      WHERE id = $1
      LIMIT 1`,
      [userId]
    );
    if (userResult.rowCount === 0) {
      return res.status(404).json({error: 'User not found'});
    }

    const user = userResult.rows[0];
    if (user.git_id) {
      return res.status(400).json({error: '2FA cannot be changed for users registered via GitHub OAuth'});
    }

    if (user.two_factor_enabled) {
      return res.status(409).json({error: '2FA is already enabled'});
    }

    const secret = generateTotpSecret(user.email);
    const otpauthUrl = secret.otpauth_url;
    const qrCodeDataUrl = await buildQrCodeDataUrl(otpauthUrl);

    await pool.query(
      `UPDATE dev_dba.users
      SET two_factor_temp_secret = $1
      WHERE id = $2`,
      [secret.base32, userId]
    );
    return res.status(200).json({
      message: '2FA setup initialized',
      qrCodeDataUrl,
      manualEntryKey: secret.base32,
    });
  } catch (error) {
    console.error('[POST /profile/2fa/setup] unexpected error:', error);
    return res.status(500).json({error: 'Failed to initialize 2FA setup'});
  }
  
}

router.post('/profile/2fa/setup', requireAuth, setupTwoFactorHandler);

async function verifyTwoFactorSetupHandler(req, res) {
  try {
    const userId = req.userId ?? req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = String(req.body?.token || req.body?.otp || '').trim();
    if (!token) {
      return res.status(400).json({ error: 'OTP code is required' });
    }

    const userResult = await pool.query(
      `SELECT id, two_factor_enabled, two_factor_temp_secret, git_id
      FROM dev_dba.users
      WHERE id = $1
      LIMIT 1`,
      [userId]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    if (user.git_id) {
      return res.status(400).json({ error: '2FA cannot be changed for users registered via GitHub OAuth' });
    }

    if (user.two_factor_enabled) {
      return res.status(409).json({ error: '2FA is already enabled'});
    }

    if (!user.two_factor_temp_secret) {
      return res.status(400).json({error: 'No pending 2FA setup found'});
    }

    const isValid = verifyTotpToken({
      secret: user.two_factor_temp_secret,
      token,
    });

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid OTP code '});
    }

    await pool.query (
      `UPDATE dev_dba.users
      SET two_factor_secret = $1, two_factor_temp_secret = NULL, two_factor_enabled = true, two_factor_enabled_at = NOW()
      WHERE id = $2`,
      [user.two_factor_temp_secret, userId]
    );

    return res.status(200).json({ message: '2FA enabled sucessfully' })
  } catch (error) {
    console.error('[POST /profile/2fa/verify] unexpected error:', error);
    return res.status(500).json({ error: 'Failed to verify 2FA setup' });
  }
}
router.post('/profile/2fa/verify', requireAuth, verifyTwoFactorSetupHandler);

async function disableTwoFactorHandler(req, res) {
  try {
    const userId = req.userId ?? req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = String(req.body?.token || req.body?.otp || '').trim();
    if (!token) {
      return res.status(400).json({ error: 'OTP code is required' });
    }

    const userResult = await pool.query(
      `SELECT id, two_factor_enabled, two_factor_secret, git_id
       FROM dev_dba.users
       WHERE id = $1
       LIMIT 1`,
       [userId]
    );
    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    if (user.git_id) {
      return res.status(400).json({ error: '2FA cannot be changed for users registered via GitHub OAuth' });
    }

    if (!user.two_factor_enabled || !user.two_factor_secret) {
      return res.status(400).json({ error: '2FA is not enabled' });
    }

    const isValid = verifyTotpToken({
      secret: user.two_factor_secret,
      token,
    });

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid OTP code' });
    }

    await pool.query(
      `UPDATE dev_dba.users
       SET two_factor_enabled = false, two_factor_secret = NULL, two_factor_temp_secret = NULL, two_factor_enabled_at = NULL
       WHERE id = $1`,
       [userId]
    );

    return res.status(200).json({ message: '2FA disabled successfully' });
  } catch (error) {
    console.error('[POST /profile/2fa/disable] unexpected error:', error);
    return res.status(500).json({ error: 'Failed to disable 2FA' });
  }
}

router.post('/profile/2fa/disable', requireAuth, disableTwoFactorHandler);

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
      `SELECT id, email, name, avatar, is_active, git_id, role
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
        `INSERT INTO dev_dba.users (name, password, email, avatar, is_active, last_login, git_id)
         VALUES ($1, $2, $3, $4, true, NOW(), $5)
         RETURNING id, email, name, avatar, is_active, role`,
        [ghUser.name || ghUser.login, hashPass, normalizedEmail, DEFAULT_AVATAR, ghUser.id]
      );
      // git_id is not stored, but could be added to the users table if needed for future features
      user = created.rows[0];
    }
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email, githubId: user.githubId , avatar: user.avatar, role: user.role},
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  
    const frontendUrl = process.env.FRONTEND_URL || 'https://localhost:443';
    const redirectTo = new URL('/auth/github/callback', frontendUrl);
    redirectTo.searchParams.set('id', String(user.id));
    redirectTo.searchParams.set('token', jwtToken);
    return res.redirect(redirectTo.toString());
  } catch (error) {
    console.log('[GET /auth/github/callback] unexpected error:', error?.response?.data || error);
    return res.status(500).json({error: "GitHub OAuth failed"});
  }
});

router.get('/admin/users', requireAuthWithRateLimit, async (req, res) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const result = await pool.query(
      `SELECT id, email, name, avatar, role, is_active
       FROM dev_dba.users
       ORDER BY name ASC`
    );
    return res.status(200).json({ users: result.rows });
  } catch (error) {
    console.log('[GET /admin/users] unexpected error:', error);
    return res.status(500).json({ error: 'Failed to load users' });
  }
});

// ========== FILE MANAGEMENT ENDPOINTS ==========

router.get('/profile/files', requireAuthWithRateLimit, async (req, res) => {
  try {
    const userId = req.userId ?? req.user?.id;
    if (!userId) {
      return res.status(401).json({error: 'Unauthorized'});
    }

    // List files in uploads directory (documents only, not avatars)
    try {
      const files = await fs.readdir(uploadDir);
      const docFiles = files.filter(f => f.endsWith('.csv') || f.endsWith('.json'));
      
      const fileStats = await Promise.all(
        docFiles.map(async (filename) => {
          const stats = await fs.stat(path.join(uploadDir, filename));
          return {
            filename,
            size: stats.size,
            uploadedAt: stats.birthtime,
            type: filename.endsWith('.csv') ? 'csv' : 'json',
          };
        })
      );

      return res.status(200).json({ files: fileStats });
    } catch (err) {
      return res.status(200).json({ files: [] });
    }
  } catch (error) {
    console.error('[GET /profile/files] unexpected error:', error);
    return res.status(500).json({error: 'Failed to load files'});
  }
});

router.post('/profile/files', requireAuthWithRateLimit, upload.single('file'), async (req, res) => {
  try {
    const userId = req.userId ?? req.user?.id;
    if (!userId) {
      return res.status(401).json({error: 'Unauthorized'});
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({error: 'No file uploaded'});
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    
    return res.status(200).json({
      message: 'File uploaded successfully',
      file: {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        type: file.mimetype,
        url: fileUrl,
      },
    });
  } catch (error) {
    console.error('[POST /profile/files] unexpected error:', error);
    return res.status(500).json({error: 'Failed to upload file'});
  }
});

router.delete('/profile/files/:filename', requireAuthWithRateLimit, async (req, res) => {
  try {
    const userId = req.userId ?? req.user?.id;
    if (!userId) {
      return res.status(401).json({error: 'Unauthorized'});
    }

    const { filename } = req.params;
    
    // Prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({error: 'Invalid filename'});
    }

    const filePath = path.join(uploadDir, filename);
    
    try {
      await fs.unlink(filePath);
      return res.status(200).json({message: 'File deleted successfully'});
    } catch (err) {
      return res.status(404).json({error: 'File not found'});
    }
  } catch (error) {
    console.error('[DELETE /profile/files/:filename] unexpected error:', error);
    return res.status(500).json({error: 'Failed to delete file'});
  }
});

// ========== RECIPE IMPORT ENDPOINT ==========

router.post('/recipes/import', requireAuthWithRateLimit, upload.single('file'), async (req, res) => {
  try {
    const userId = req.userId ?? req.user?.id;
    if (!userId) {
      return res.status(401).json({error: 'Unauthorized'});
    }

    const currentUserResult = await pool.query(
      `SELECT name
       FROM dev_dba.users
       WHERE id = $1
       LIMIT 1`,
      [userId]
    );

    const currentUserName = currentUserResult.rows[0]?.name || null;
    if (!currentUserName) {
      return res.status(404).json({error: 'User not found'});
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({error: 'No file uploaded'});
    }

    // Read file content
    const fileContent = await fs.readFile(file.path, 'utf-8');
    
    // Parse based on file type
    let recipes = [];
    if (file.mimetype === 'text/csv') {
      recipes = parseCSV(fileContent);
    } else if (file.mimetype === 'application/json') {
      recipes = parseJSON(fileContent);
    } else {
      return res.status(400).json({error: 'Only CSV or JSON files are supported'});
    }

    // Validate recipes
    const validationResults = validateRecipes(recipes);
    const validRecipes = validationResults.filter(r => r.valid);
    const invalidRecipes = validationResults.filter(r => !r.valid);

    // Insert valid recipes into pending_recipes
    let insertedCount = 0;
    const errors = [];

    for (const result of validRecipes) {
      try {
        const recipe = result.recipe;
        const author = currentUserName;
        await pool.query(
          `INSERT INTO public.pending_recipes (name, ingredients, diet, cost, portions, prep_time, cooking_time, instructions, url, author, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending')`,
          [
            recipe.name,
            JSON.stringify(recipe.ingredients),
            recipe.diet || 'Vegan',
            recipe.cost || 0,
            recipe.portions || 1,
            recipe.prep_time || null,
            recipe.cooking_time || null,
            recipe.instructions || null,
            recipe.url || null,
            author,
          ]
        );
        insertedCount++;
      } catch (err) {
        errors.push(`Row ${result.index}: ${err.message}`);
      }
    }

    // Clean up uploaded file
    try {
      await fs.unlink(file.path);
    } catch {}

    return res.status(200).json({
      message: `Import completed: ${insertedCount} recipes imported`,
      stats: {
        total: recipes.length,
        imported: insertedCount,
        failed: invalidRecipes.length + errors.length,
      },
      failures: {
        invalid: invalidRecipes.map(r => ({
          index: r.index,
          recipe: r.recipe.name,
          errors: r.errors,
        })),
        insertErrors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error) {
    console.error('[POST /recipes/import] unexpected error:', error);
    return res.status(500).json({error: 'Failed to import recipes'});
  }
});

module.exports = {authRouter: router, users};