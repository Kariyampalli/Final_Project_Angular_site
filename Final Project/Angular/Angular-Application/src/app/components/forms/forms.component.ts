import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Admin } from '../models/admin.model';
import { AuthentificationService } from 'src/app/services/authentification/authentification.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import * as uuid from 'uuid';
import { Portfolio } from '../models/portfolio.model';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { FetchSendDataService } from 'src/app/services/fetch-send-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})
export class FormsComponent implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm | undefined;

  public regErrorLabel = '';

  public loginErrorLabel = '';

  public admin: Admin = {} as Admin;

  myusers!: Admin[];

  constructor(
    public authentificationService: AuthentificationService,
    private dialog: DialogService,
    private logger: LoggerService,
    private fetchSendDataService: FetchSendDataService,
    private router: Router) {
    //this.fetchDataService.getData();
  }

  ngOnInit(): void {
    this.logger.log('Called Forms page');
  }

  public async handleLogin(): Promise<void> {

    const encodedData = btoa('Hello, world');   
    console.log(encodedData); // SGVsbG8sIHdvcmxk

    const decodedData = atob(encodedData);
    console.log(decodedData);

    console.log('normal: ' + this.admin.password);
    this.MakeAuthentificationRequest('admins/login', true);
  }

  public async handleRegistration(): Promise<void> {
    this.MakeAuthentificationRequest('admins/registration', false);
  }

  private async MakeAuthentificationRequest(
    url: string,
    isLogin: boolean): Promise<void> {
    console.log(this.admin.name);
    console.log(this.admin.password);
    if (!isLogin){
      this.admin.id = uuid.v4();
    }

    this.admin.portfolio = {} as Portfolio;
    const res = await Promise.resolve(
      this.authentificationService.authenticate(this.admin, url, isLogin));
    if (res) {
      this.admin.name = ' ';
      this.admin.password = '';
      if (isLogin) {
        this.router.navigate(['/']);
        this.dialog.Success('LOGIN SUCCESS!', ':)');
      } else {
        this.dialog.Success('REGISTRATION SUCCESS!', ':)');
      }
    } else {
      if (isLogin) {
        this.dialog.Error(
          'LOGIN FAILED!',
          'Please use coorect login data or try agian later.');
      } else {
        this.dialog.Error(
          'REGISTRATION FAILED!',
          'Admin already exists or registration data is invalid.');
      }
    }
  }
}
