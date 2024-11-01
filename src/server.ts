import * as express from 'express';
import * as compression from 'compression';
import * as cors from 'cors';
import * as http from 'http';
import { Request, Response, NextFunction } from 'express';
import { renderRoutes } from './routes';
import { B2Service } from './services/b2.service';

export class Server {
    private readonly _port: number;
    private readonly _app: express.Application;
    private readonly _server: http.Server;

    constructor(port: number) {
        this._port = port;

        this._app = express();

        this._server = http.createServer(this._app);
    }

    public start(): void {
        this._initializeMiddlewares();

        this._initializeErrorHandler();

        this._run();
    }

    private _initializeMiddlewares(): void {
        this._app.use(express.json({ limit: '50mb' }));
        this._app.use(express.urlencoded({ extended: true }));

        this._app.use(cors());

        this._app.use(compression());

        this._app.set('view engine', 'ejs');
        this._app.use(express.static('public'));

        renderRoutes(this._app);
    }

    private _initializeErrorHandler(): void {
        this._app.use((error: Error, req: Request, res: Response, next: NextFunction): Response => {
            console.error(error);
        
            return res.status(500).send('An unknown error occurred. Please try again later!');
        });
    }

    private _run(): void {
        this._server.listen(this._port, () => {
            console.log(`Server is running on port ${this._port}`);
        });
    }
}