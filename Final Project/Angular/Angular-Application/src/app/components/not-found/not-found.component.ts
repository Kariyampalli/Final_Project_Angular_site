import { Component, OnInit } from '@angular/core';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  constructor(private logger: LoggerService) {}

  ngOnInit(): void {
    this.logger.log('Success dialog called');
  }
}
