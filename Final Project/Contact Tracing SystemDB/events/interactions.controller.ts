import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { controller, httpDelete, httpGet, httpPost, httpPut, interfaces } from 'inversify-express-utils';
import { DatabaseService } from '../core/services/database.service';
import { LoggerService } from '../core/services/logger.service';
import { Entry } from '../models/entry.model';
import { MyResponse } from '../models/response.model';

@controller('/interactions')
@injectable()
export class InteractionsController implements interfaces.Controller {
  constructor(
    @inject(DatabaseService.name) private databaseService: DatabaseService,@inject(LoggerService.name) private loggerService:LoggerService
  ) {}

  @httpPost('/')
  public postInteraction(request: Request, response: Response): void {
  request.header("Access-Control-Allow-Origin", "*");
  request.header("Access-Control-Allow-Header" , "Origin, X-Requested-With, Content-Type, Accept");
  this.loggerService.info("(POST) Interaction url:" + request.url);
  this.loggerService.info("(POST) Interaction body:" + request.body);
 
    this.databaseService.insertInteraction(request.body).then((result: boolean) => {
        console.log(result);
        response.json(result);
      });
  }

  @httpGet('/')
  public getInteractions(request: Request, response: Response): void {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Header" , "Origin, X-Requested-With, Content-Type, Accept");
    this.loggerService.info("(GET) Sending interactions");
    this.databaseService.getAllInteractions().then((result: Array<string>) => {
      response.json(result);
    });
  }
  
}
