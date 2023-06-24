import { Component, OnInit } from '@angular/core';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
  selector: 'app-logout-success',
  templateUrl: './logout-success.component.html',
  styleUrls: ['./logout-success.component.scss'],
})
export class LogoutSuccessComponent implements OnInit {
  constructor(private logger: LoggerService) {}

  ngOnInit(): void {
    this.logger.log('Success logout dialog called');
  }
}
