const jwt = require('jsonwebtoken');
const { rateLimit } = require('./rateLimit');

function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token)
        return res.status(401).json({error: "Missing token"});
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = req.user.sub ?? req.user.id;
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
    requireAuth(req, res, () => {
        // Depois aplica rate limit
        rateLimit(req, res, next);
    });
}

module.exports = { requireAuth, requireAuthWithRateLimit };