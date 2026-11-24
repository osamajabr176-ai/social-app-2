import express from 'express';
import  router  from './routes';
import cookieParser from 'cookie-parser';
import { globalerror } from './lib/error/error.handler';
export function createApp() {
    const app = express();
    app.use(cookieParser());
    app.use(express.json());
    app.use('/api' ,router);
    app.use(globalerror);
    return app;
}
