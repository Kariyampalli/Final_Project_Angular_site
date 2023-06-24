import { Component, OnInit } from '@angular/core';
import { FetchSendDataService } from 'src/app/services/fetch-send-data.service';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/services/dialog/dialog.service';

@Component({
  selector: 'app-checking',
  templateUrl: './checking.component.html',
  styleUrls: ['./checking.component.scss'],
})
export class CheckingComponent implements OnInit {

  public buttonText!:string;

  public name!:string;

  public accessible!:boolean;

  public checkedIn!:boolean;

  constructor(private fetchSendDataService:FetchSendDataService, private dialog:DialogService, private router: Router) { 

  }

  public async ngOnInit(): Promise<void> {
    this.accessible = false;
    console.log(this.router.url.split('/checking/')[1]);
    if (await Promise.resolve(this.VerifyKey(this.router.url.split('/checking/')[1]))) {
      this.buttonText = 'CHECK IN';
      this.accessible = true;
      this.checkedIn = false;
    } else {
      this.dialog.AccessDenied();
    }
  }

  public Click():void {
    if (this.checkedIn) {  
      this.buttonText = 'CHECK IN';
      this.checkedIn = !this.checkedIn;
    } else {
      if (this.name.trim().length != 0){
        this.fetchSendDataService.postCheckIn(this.name);
        this.buttonText = 'CHECK OUT';
        this.checkedIn = !this.checkedIn;
      }
    }
   
  }

  private async VerifyKey(key:string):Promise<boolean>{
    return Promise.resolve(this.fetchSendDataService.ValidateCheckInKey(key));
  }

}
