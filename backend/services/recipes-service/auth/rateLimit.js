const redis = require('redis');

const RATE_LIMIT_FAIL_OPEN = process.env.RATE_LIMIT_FAIL_OPEN === 'false';
const RATE_LIMIT_PER_MINUTE = Math.max(1, parseInt(process.env.RATE_LIMIT_PER_MINUTE || '50', 10));

// Conecta ao Redis
const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6378,
    }
});

redisClient.on('error', err => console.log('Redis error:', err));
redisClient.connect().catch(err => {
    console.log('Failed to connect to Redis:', err);
});

// Middleware de rate limit por userId
// Limite: RATE_LIMIT_PER_MINUTE requests por minuto (60 segundos)
async function rateLimit(req, res, next) {
    if (!req.user)
        console.log('Warning: rateLimit called without req.user set');
    const userId = req.user.sub ?? req.user.id;
    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    const userRole = req.user.role;
    if (userRole === 'admin') {
        return next(); // Admin sem limite
    }

    const limit = RATE_LIMIT_PER_MINUTE; // máximo de requests por minuto

    const key = `ratelimit:${String(userId)}:${Math.floor(Date.now() / 60000)}`; // chave por minuto

    try {
        const count = await redisClient.incr(key);

        // Na primeira vez, define TTL de 70 segundos (um pouco mais que 60)
        if (count === 1) {
            await redisClient.expire(key, 70);
        }

        // Se excedeu o limite
        if (count > limit) {
            return res.status(429).json({
                error: 'Rate limit exceeded',
                limit: limit,
                remaining: 0,
            });
        }

        // Headers informativos
        res.set('X-RateLimit-Limit', limit);
        res.set('X-RateLimit-Remaining', limit - count);
        res.set('X-RateLimit-Reset', new Date(Math.floor(Date.now() / 60000) * 60000 + 60000).toISOString());

        next();
    } catch (error) {
        console.log('Rate limit error:', error);

        if (RATE_LIMIT_FAIL_OPEN) {
            // Modo tolerante a falhas: mantém a API disponível mesmo sem Redis.
            return next();
        }

        // Modo seguro (padrão): bloqueia requisições quando o limitador está indisponível.
        res.set('Retry-After', '60');
        return res.status(503).json({
            error: 'Rate limiter unavailable',
        });
    }
}

module.exports = { rateLimit };
