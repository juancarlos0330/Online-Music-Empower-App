export declare class Server {
    private readonly _port;
    private readonly _app;
    private readonly _server;
    constructor(port: number);
    start(): void;
    private _initializeMiddlewares;
    private _initializeErrorHandler;
    private _run;
}
