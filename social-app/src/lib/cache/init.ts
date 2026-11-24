
import { env } from '../config/env';
import { RedisCasheProvider } from '../../pkg/cache/redis';

export const cacheprovider = new RedisCasheProvider({
host : env.redis.host,
port : env.redis.port,
password : env.redis.password || '',
});