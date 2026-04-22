const jwt = require('jsonwebtoken');
const { rateLimit } = require('./rateLimit');

function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token)
        return res.status(401).json({error: "Missing token"});
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        if (req.user?.purpose) {
            return res.status(401).json({error: "Invalid token type"});
        }
        req.userId = req.user.sub ?? req.user.id;
        if (!req.userId) {
            return res.status(401).json({error: "Invalid token payload"});
        }
        req.userRole = req.user.role;
        next();
    }
    catch(e) {
        return res.status(401).json({error: "invalid or expired token"});
    }
}

// Middleware que combina auth + rate limit
async function requireAuthWithRateLimit(req, res, next) {
    // Primeiro autentica
    return requireAuth(req, res, () => {
        // Depois aplica rate limit
        return rateLimit(req, res, next);
    });
}

module.exports = { requireAuth, requireAuthWithRateLimit };