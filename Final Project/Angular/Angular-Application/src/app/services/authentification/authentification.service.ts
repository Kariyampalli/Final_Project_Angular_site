import { Injectable } from '@angular/core';
import { Admin } from 'src/app/components/models/admin.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyResponse } from 'src/app/components/models/myResponse.model';
import { ResponseErrorService } from '../response-error.service';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  private authenticated = false;

  private id!:string;

  private admin!:Admin;

  private headerDict = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Header': 'Content-Type',
  };
  
  private requestOptions = {
    headers: new HttpHeaders(this.headerDict),
  };

  constructor(private http: HttpClient, private responseErrorService:  ResponseErrorService) {}

  async authenticate(admin: Admin, url: string, isLogin:boolean): Promise<boolean> {

    const res = await Promise.resolve(
      this.SendAuthentificationRequest(admin, url, isLogin));
    this.authenticated = res;
    console.log('RES:' + res);
    console.log('AUT:' + this.authenticated);
    return Promise.resolve(this.authenticated);
  }

  private async SendAuthentificationRequest(
    admin: Admin,
    url: string,
    isLogin:boolean): Promise<boolean> {
    //const u = JSON.stringify(admin);
    return new Promise((resolve) => {
      this.http.post(url, admin, this.requestOptions).subscribe(
        async (response) => {
          const res = response as unknown;
          const myResponse:MyResponse = res as MyResponse;

          if (myResponse.status) {
            //this.authAdmin = await Promise.resolve(this.getAuthAdmin(admin.name));          
            console.log(myResponse.content);          
            if (isLogin) {
              this.id = myResponse.content;
            } else {
              this.id = admin.id;
            }  
            console.log('Here');
            localStorage.setItem(this.id, JSON.stringify(await Promise.resolve(this.getAdminInfo())));       
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (error: Response) => {
          this.responseErrorService.handleError(error);
        });
    });
  }

  public getAdminInfo():Promise<Admin>{
    console.log(this.id);
    return new Promise((resolve)=>{
      this.getAuthAdminData().subscribe((response)=>{
        if (response.status){
          console.log('RECEIVED RESP:' + response.content);
          resolve(response.content);
        }
      },
      (error: Response) => {
        this.responseErrorService.handleError(error);
      });
    });
  }

  private getAuthAdminData(): Observable<any> {
    return this.http.get('/admins/admin/' + this.id);
  }


  public GetIsAutehnticated(): boolean {
    return this.authenticated;
  }

  public SetToNormalUser(): void {
    localStorage.removeItem(this.id);  
    this.authenticated = false;
    this.id = ''; 
  }

 
}
