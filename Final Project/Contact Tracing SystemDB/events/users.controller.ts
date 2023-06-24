import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam, next, httpPut } from "inversify-express-utils";
import { DatabaseService } from '../core/services/database.service';
import { LoggerService } from '../core/services/logger.service';
import { Checking } from '../models/checking.model';
import { MyResponse } from '../models/response.model';

@controller('/users')
@injectable()
export class UsersController implements interfaces.Controller {
  constructor(
    @inject(DatabaseService.name) private databaseService: DatabaseService,@inject(LoggerService.name) private loggerService:LoggerService
  ) {}

  @httpGet('/')
  public getChecking(request: Request, response: Response): void {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Header" , "Origin, X-Requested-With, Content-Type, Accept");
    this.loggerService.info("(Get) Sending all checked in users" );
    this.databaseService.getAllCheckings().then((result: Array<Checking>) => {
      response.json(result);
    });
  }

  @httpPost('/')
  public postCheckId(request: Request, response: Response): void {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Header" , "Origin, X-Requested-With, Content-Type, Accept");

    this.loggerService.info("(Post) Checking user key for check in: " + request.body.key);
    const key = request.body.key;

    this.databaseService.userKeyIsVaild(key).then((result: boolean) => {
      console.log(result);
      const myResponse = {} as MyResponse;
      myResponse.content = undefined;
      myResponse.status = result;
      response.json(myResponse);
    });
  }

  @httpPost('/checkIn')
  public getCheckIn(request: Request, response: Response): void {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Header" , "Origin, X-Requested-With, Content-Type, Accept");
    next();
    this.loggerService.info("(Post) Checking in user: " + request.body.name);
    const checking = {} as Checking;
    checking.name = request.body.name;
    checking.date = new Date();

    this.databaseService.insertChecking(checking).then((result: boolean) => {
      response.json(result);
    });
  }

 
}
