import { Component, OnInit } from '@angular/core';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
  selector: 'app-accessdenied',
  templateUrl: './accessdenied.component.html',
  styleUrls: ['./accessdenied.component.scss'],
})
export class AccessdeniedComponent implements OnInit {

  constructor(private logger:LoggerService) { }

  ngOnInit(): void {
    this.logger.log('Access denied dialog called');
  }

}
