import { Component } from '@angular/core';
//import { AbstractLogger } from './services/abstract-logger';
import { LoggerService } from './services/logger/logger.service';
import 'reflect-metadata';
import { AuthentificationService } from './services/authentification/authentification.service';
import { DialogService } from './services/dialog/dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  public title = 'Contact Tracing System';

  public _logger;

  constructor(protected loggerService: LoggerService, public authentificationService:AuthentificationService, public dialog:DialogService /*AbstractLogger*/){
    this._logger = loggerService;
    this._logger.log('APP component init');
  }

  public Logout():void{
    this.authentificationService.SetToNormalUser();
    this.dialog.Success('LOGGED OUT SUCCESSFULLY!', '');
  }
}