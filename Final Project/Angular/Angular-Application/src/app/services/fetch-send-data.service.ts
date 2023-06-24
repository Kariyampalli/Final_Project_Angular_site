import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Admin } from '../components/models/admin.model';
import { CheckingKey } from '../components/models/CheckInOut/checking-key.model';
import { Checking } from '../components/models/CheckInOut/checking.model';
import { Entry } from '../components/models/entry.model';
import { Interaction } from '../components/models/interaction.model';
import { MyResponse } from '../components/models/myResponse.model';
import { ResponseErrorService } from './response-error.service';

@Injectable({
  providedIn: 'root',
})
export class FetchSendDataService {
  constructor(private http: HttpClient, private responseErrorService:ResponseErrorService) {}

  private headerDict = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Header': 'Content-Type',
  };

  private requestOptions = {
    headers: new HttpHeaders(this.headerDict),
  };

  async InsertEntry(url: string, entry: Entry): Promise<boolean> {
  

    const u = JSON.stringify(entry);
    const res = await Promise.resolve(
      this.SendPostRequest(u, this.requestOptions, url));
    return Promise.resolve(res);
  }

  async deleteEntry(url: string, id: string): Promise<boolean> {
    const res = await Promise.resolve(this.SendDeleteRequest(id, url));
    return Promise.resolve(res);
  }

  private async SendDeleteRequest(id: string, url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const options = {
        headers: new HttpHeaders(this.headerDict),
        body: id,
      };
      console.log('SENDING TO ' + url + 'options:' + options.body);
      this.http.delete(url + id).subscribe((response) => {
        if (response) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      (error: Response) => {
        this.responseErrorService.handleError(error);
        resolve(false);
      });
    });
  }

  public updateEntry(url: string, entry: Entry): Promise<boolean> {
    return new Promise((resolve) => {
      const options = {
        headers: new HttpHeaders(this.headerDict),
      };
      url = url + entry.id;
      console.log('SENDING TO ' + url);
      this.http.put(url, JSON.stringify(entry), options).subscribe((response) => {
        if (response) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      (error: Response) => {
        this.responseErrorService.handleError(error);
        resolve(false);
      });
    });
  }

  public updateAdmin(url: string, admin: Admin): Promise<boolean> {
    return new Promise((resolve) => {
      const options = {
        headers: new HttpHeaders(this.headerDict),
      };
      console.log('SENDING TO ' + url);
      this.http.put(url, admin, options).subscribe((response) => {
        if (response) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      (error: Response) => {
        this.responseErrorService.handleError(error);
        resolve(false);
      });
    });
  }

  private async SendPostRequest(
    entry: string,
    options: any,
    url: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.http.post(url, entry, options).subscribe((response) => {
        if (response) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      (error: Response) => {
        this.responseErrorService.handleError(error);
        resolve(false);
      });
    });
  }

  
  getEntries(): Promise<Entry[]> {
    return new Promise((resolve) => {
      this.ReceiveEntries().subscribe(
        (response) => {
          console.log(response);
          resolve(response);
        },
        (error: Response) => {
          this.responseErrorService.handleError(error);         
        });
    }); 
  }

  private ReceiveEntries(): Observable<any> {
    return this.http.get('http://localhost:9999/entries');
  }

  public postInteraction(interaction:string):Promise<boolean>{
    const inter:Interaction = {} as Interaction;
    inter.interaction = interaction;
    return new Promise((resolve) => {
      this.http.post('/interactions/', JSON.stringify(inter), this.requestOptions).subscribe((response)=>{
        const res = response as unknown;
        const myResponse:MyResponse = res as MyResponse;
        resolve(myResponse.status);
      },
      (error: Response) => {
        this.responseErrorService.handleError(error);
        resolve(false);
      });
    });
  }

  public postCheckIn(name:string):Promise<boolean>{
    return new Promise((resolve) => {
      const checking = {} as Checking;
      checking.name = name;
      this.http.post('/users/checkIn', JSON.stringify(checking), this.requestOptions).subscribe((response)=>{
        const res = response as unknown;
        const myResponse:MyResponse = res as MyResponse;
        resolve(myResponse.status);
      },
      (error: Response) => {
        this.responseErrorService.handleError(error);
        resolve(false);
      });
    });
  }

  public ValidateCheckInKey(key:string):Promise<boolean>{
    return new Promise((resolve) => {
      const checkingKey = {} as CheckingKey;
      checkingKey.key = key;
      this.http.post('/users/', JSON.stringify(checkingKey), this.requestOptions).subscribe((response)=>{
        const res = response as unknown;
        const myResponse:MyResponse = res as MyResponse;
        resolve(myResponse.status);
      },
      (error: Response) => {
        this.responseErrorService.handleError(error);
        resolve(false);
      });
    });
  }

}
