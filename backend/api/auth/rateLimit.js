const redis = require('redis');

const RATE_LIMIT_FAIL_OPEN = 'false'; // 'true' para modo tolerante a falhas (permite requisições mesmo se Redis estiver indisponível)

// Conecta ao Redis
const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    }
});

redisClient.on('error', err => console.log('Redis error:', err));
redisClient.connect().catch(err => {
    console.log('Failed to connect to Redis:', err);
});

// Middleware de rate limit por userId
// Limite: 10 requests por minuto (60 segundos)
async function rateLimit(req, res, next) {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const key = `ratelimit:${userId}:${Math.floor(Date.now() / 60000)}`; // chave por minuto
    const limit = 10; // máximo de requests por minuto

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
