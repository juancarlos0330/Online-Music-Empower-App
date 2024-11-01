import { Application } from 'express';
import defaultRouter from './default';
import homeRouter from './home';

export const renderRoutes = (app: Application) => {
    app.use(homeRouter);
    app.use(defaultRouter);
};