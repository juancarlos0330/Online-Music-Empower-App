import { Config } from './common/config';
import { Server } from './server';

new Server(Config.PORT).start();