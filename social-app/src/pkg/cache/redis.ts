import Redis from "ioredis";
import { ICacheprProvider } from "./cache.interface";
interface IredisConfig {
    host : string,
    port : number ,
    password : string ,

}
export class RedisCasheProvider implements ICacheprProvider {
   private  client :Redis;

    constructor(config : IredisConfig) { 
        this.client =new Redis({
          host :config.host,
          port: config.port,
          password: config.password,
          lazyConnect: true,
          maxLoadingRetryTime: 3,
        });
        this.client.on('error', (err:Error) => {
          console.log('Redis error:', err.message);
        }); 
        this.client.connect().catch((err :Error)=> console.log('failed to connect to redis',err.message));

    }
    async set(key :string ,value :string, ttl :any) {
        return this.client.set(key, value, 'EX', ttl);
    }
   async get(key: string){
        return this.client.get(key);
    }
     async del(key :string){
        return this.client.del(key);
    }
    async  ttl(key :string) {
        return this.client.ttl(key);
    }
} 