import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { Dialog } from '../../models/dialog.model';

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.scss'],
})
export class SuccessDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { dialog: Dialog },
    private logger: LoggerService) {}

  ngOnInit(): void {
    this.logger.log('Success dialog called');
  }
}
