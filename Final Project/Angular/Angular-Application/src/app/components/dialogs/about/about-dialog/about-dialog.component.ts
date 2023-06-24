import { Component, OnInit } from '@angular/core';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.scss'],
})
export class AboutDialogComponent implements OnInit {

  public name!:string;

  public version!:string;

  constructor(private loggerService:LoggerService) { 
    this.loggerService.log('About dialog called');
  }

  ngOnInit(): void {
    this.name = environment.name;
    this.version = environment.version;
  }

}
