import { Injectable } from '@angular/core';
import { DialogService } from './dialog/dialog.service';

@Injectable({
  providedIn: 'root',
})
export class ResponseErrorService {
  constructor(private dialog: DialogService) {}

  public handleError(error: Response): void {
    switch (error.status) {
      case 504:
        this.dialog.Error(
          'COULD NOT REACH API',
          'Server of the api tried to be is not running!\nError:' +
            error.statusText,
        );
        break;
      default:
        this.dialog.Error(
          'UNEXPECTED ERROR ACCURED',
          error.statusText + '\nCode: ' + error.status,
        );
        break;
    }
  }
}
