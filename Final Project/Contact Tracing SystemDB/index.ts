import 'reflect-metadata';
import { InversifyExpressServer, next, response } from 'inversify-express-utils';
import { IoContainer } from './core/ioc/ioc.container';
import { LoggerService } from './core/services/logger.service';
import { DatabaseService } from './core/services/database.service';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

const container = new IoContainer();
container.init();

const logger = container.getContainer().resolve(LoggerService);
const databseService = container.getContainer().resolve(DatabaseService);

const server = new InversifyExpressServer(container.getContainer());
server.setConfig((app) => {
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(bodyParser.json());
  });
   
databseService.initialize().then(()=>{
    const app = server.build();
    app.use(cors()); 
    app.options('*', cors());
    app.use(function(req,res){
        res.header('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'DELETE,GET,OPTIONS,PATCH,POST');
          res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Authorization, Content-Type, X-Requested-With, Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers');
          next();
         });
    app.listen(9999);
    logger.info('Server listening on port 9999')
}).catch((error)=>{
    logger.error(error, 'Error while starting express server');
    process.exit(-1);
});

