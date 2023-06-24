import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { controller, httpDelete, httpGet, httpPost, httpPut, interfaces } from 'inversify-express-utils';
import { DatabaseService } from '../core/services/database.service';
import { LoggerService } from '../core/services/logger.service';
import { Entry } from '../models/entry.model';
import { MyResponse } from '../models/response.model';

@controller('/entries')
@injectable()
export class EntriesController implements interfaces.Controller {
  constructor(
    @inject(DatabaseService.name) private databaseService: DatabaseService,@inject(LoggerService.name) private loggerService:LoggerService
  ) {}

  @httpGet('/')
  public getEntries(request: Request, response: Response): void {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Header" , "Origin, X-Requested-With, Content-Type, Accept");
    this.loggerService.info("(Get) Sending all entries");
    this.databaseService.getAllEntries().then((result: Array<Entry>) => {
      response.json(result);
    });
  }

  @httpGet('/entry/*')
  public getEntry(request: Request, response: Response): void {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Header" , "Origin, X-Requested-With, Content-Type, Accept");
    this.loggerService.info("(Get) Sending requested entry");
    this.databaseService.getAnEntry(request.url.split("/entry/")[1]).then((result: MyResponse) => {
      console.log(result);
      response.json(result);
    });
  }

  @httpDelete('/entry/*')
  public deleteEntry(request: Request, response: Response): void {
    request.header("Access-Control-Allow-Origin", "*");
    request.header("Access-Control-Allow-Header" , "Origin, X-Requested-With, Content-Type, Accept");
    this.loggerService.info("(Delete) Deleting requested entry: " + request.url.split("/delete/")[1]);
this.databaseService.deleteEntry(request.url.split("/entry/")[1]).then((result: boolean) => {
  console.log(result);
  response.json(result);
});   
  }

  @httpPut('/entry/*')
  public updateEntry(request: Request, response: Response): void {
    request.header("Access-Control-Allow-Origin", "*");
    request.header("Access-Control-Allow-Header" , "Origin, X-Requested-With, Content-Type, Accept");
    this.loggerService.info("REQUEST URL: " + request.url);
    this.loggerService.info("REQUEST BODY: " + request.body);
    this.loggerService.info("(Put) Updating requested entry: " + request.url.split("/advisement/")[1], request.body);
    this.databaseService.updateEntry(request.url.split("/entry/")[1], request.body).then((result: boolean) => {
      console.log(result);
      response.json(result);
    });   
}
  @httpPost('/')
  public postEntry(request: Request, response: Response): void {
  request.header("Access-Control-Allow-Origin", "*");
  request.header("Access-Control-Allow-Header" , "Origin, X-Requested-With, Content-Type, Accept");

  this.loggerService.info(request.body);
    const entry:Entry = {} as Entry;
    entry.id = request.body.id;
    entry.qrId = request.body.qrId;
    entry.qrcode = request.body.qrcode;
    entry.name = request.body.name;
    entry.company = request.body.company;
    entry.address = request.body.address;
    entry.country = request.body.country;
    entry.city = request.body.city;   
    entry.postalCode = request.body.postalCode;

    this.databaseService.insertEntry(entry).then((result: boolean) => {
      console.log(result);
      response.json(result);
    });
  }
  
}
