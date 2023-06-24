import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam, next, httpPut } from "inversify-express-utils";
import { DatabaseService } from '../core/services/database.service';
import { LoggerService } from '../core/services/logger.service';
import { Admin } from '../models/admin.model';
import { MyResponse } from '../models/response.model';

@controller('/admins')
@injectable()
export class AdminsController implements interfaces.Controller {
  constructor(
    @inject(DatabaseService.name) private databaseService: DatabaseService, @inject(LoggerService.name) private loggerService:LoggerService
  ) {}

  @httpGet('/')
  public getAdmins(request: Request, response: Response): void {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Header" , "Origin, X-Requested-With, Content-Type, Accept");
    this.loggerService.info("(Get) Sending all admins");
    next();
    this.databaseService.getAllAdmins().then((result: Array<Admin>) => {
      response.json(result);
    });
  }

  @httpGet('/admin/*')
  public getAdmin(request: Request, response: Response): void {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Header" , "Origin, X-Requested-With, Content-Type, Accept");
    next();
    this.loggerService.info("(Get) Sending requested admin: " + request.url.split("/admin/")[1]);
    this.databaseService.getAdmin(request.url.split("/admin/")[1]).then((result: MyResponse) => {
      console.log(result);
      response.json(result);
    });
    
  }
  ///users/add
  @httpPut('/admin/*')
  public updateAdmin(request: Request, response: Response): void {
  request.header("Access-Control-Allow-Origin", "*");
  request.header("Access-Control-Allow-Header" , "Origin, X-Requested-With, Content-Type, Accept");
  this.loggerService.info("(Put) Updating requested admin: " + request.url.split("/admin/")[1]);
    this.databaseService.updateAdmin(request.url.split("/admin/")[1], request.body).then((result: any) => {
      if(result == null){
        response.json(false);
      }
      else{
        console.log(result);
        response.json(result.value);
      }
    });   
  }

  @httpPost('/login')
  public postLogin(request: Request, response: Response): void {
  request.header("Access-Control-Allow-Origin", "*");
  request.header("Access-Control-Allow-Header" , "Origin, X-Requested-With, Content-Type, Accept");
  this.loggerService.info("(Post) Login: " + request.body);
    const admin:Admin = {} as Admin;
    admin.name = request.body.name;
    admin.password = request.body.password;
     this.databaseService.checkAdmin(admin,true).then((result: MyResponse) => {
        console.log(result);
        response.json(result);
      });
  }

  @httpPost('/registration')
  public postRegistration(request: Request, response: Response): void {
  request.header("Access-Control-Allow-Origin", "*");
  request.header("Access-Control-Allow-Header" , "Origin, X-Requested-With, Content-Type, Accept");
  this.loggerService.info("(Post) Registration: " + request.body);
    const admin:Admin = {} as Admin;
    admin.id = request.body.id;
    admin.name = request.body.name;
    admin.password = request.body.password;
    admin.portfolio = request.body.portfolio;     
      const myResponse:MyResponse = {} as MyResponse;
      myResponse.content = undefined;
      this.databaseService.insertAdmin(admin).then((result: boolean) => {
        myResponse.status = result;
        response.json(myResponse);
      });
    }
}
