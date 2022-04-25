/* eslint-disable no-console */
import { Application } from '@app/app';
import { WordValidationService } from '@app/services/word-validation.service';
import * as http from 'http';
import { AddressInfo } from 'net';
import * as io from 'socket.io';
import { Service } from 'typedi';
import { MultiplayerController } from './controllers/multiplayer.controller';
import { DatabaseService } from './services/database.service';
import { MultiplayerService } from './services/multiplayer.service';
import { DictionaryService } from '@app/services/dictionary.service';

export const BASE_DIX = 10;
@Service()
export class Server {
    private static readonly appPort: string | number | boolean = Server.normalizePort(process.env.PORT || '3000');
    private static readonly baseDix: number = BASE_DIX;
    private server: http.Server;
    private sio: io.Server;
    private multiplayerService: MultiplayerService;
    private multiplayerController: MultiplayerController;
    private wordValidationService: WordValidationService;
    private database: DatabaseService;
    private dictionaryService: DictionaryService;

    constructor(private readonly application: Application) {}

    private static normalizePort(val: number | string): number | string | boolean {
        const port: number = typeof val === 'string' ? parseInt(val, this.baseDix) : val;
        if (isNaN(port)) {
            return val;
        } else if (port >= 0) {
            return port;
        } else {
            return false;
        }
    }
    async init(): Promise<void> {
        this.application.app.set('port', Server.appPort);

        this.server = http.createServer(this.application.app);

        this.sio = new io.Server(this.server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

        this.multiplayerService = new MultiplayerService();
        this.dictionaryService = new DictionaryService();
        this.wordValidationService = new WordValidationService();
        this.database = new DatabaseService();
        this.multiplayerController = new MultiplayerController(
            this.multiplayerService,
            this.dictionaryService,
            this.wordValidationService,
            this.sio,
            this.database,
        );
        this.multiplayerController.handleSockets();

        this.server.listen(Server.appPort);
        this.server.on('error', (error: NodeJS.ErrnoException) => this.onError(error));
        this.server.on('listening', () => this.onListening());

        try {
            await this.database.start();
            console.log('Database connection successful !');
        } catch {
            console.error('Database connection failed !');
            process.exit(1);
        }
    }

    private onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== 'listen') {
            throw error;
        }
        const bind: string = typeof Server.appPort === 'string' ? 'Pipe ' + Server.appPort : 'Port ' + Server.appPort;
        switch (error.code) {
            case 'EACCES':
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Se produit lorsque le serveur se met à écouter sur le port.
     */
    private onListening(): void {
        const addr = this.server.address() as AddressInfo;
        const bind: string = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
        console.log(`Listening on ${bind}`);
    }
}
