import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AboutDialogComponent } from 'src/app/components/dialogs/about/about-dialog/about-dialog.component';
import { AccessdeniedComponent } from 'src/app/components/dialogs/accessdenied/accessdenied.component';
import { EditEntryComponent } from 'src/app/components/dialogs/edit-entry/edit-entry.component';
import { ErrorDialogComponent } from 'src/app/components/dialogs/error-dialog/error-dialog.component';
import { SuccessDialogComponent } from 'src/app/components/dialogs/success-dialog/success-dialog.component';
import { Dialog } from 'src/app/components/models/dialog.model';
import { Entry } from 'src/app/components/models/entry.model';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialog: Dialog = {} as Dialog;
  
  constructor(public matDialog: MatDialog) {}

  public Success(title: string, content: string) {
    this.dialog.title = title;
    this.dialog.content = content;
    this.matDialog.open(SuccessDialogComponent, {
      data: { dialog: this.dialog },
    });
  }

  public Error(title: string, content: string) {
    this.dialog.title = title;
    this.dialog.content = content;
    this.matDialog.open(ErrorDialogComponent, {
      data: { dialog: this.dialog },
    });
  }

  public AccessDenied() {
    this.matDialog.open(AccessdeniedComponent);
  }

  public EditEntryDialog(entryToEdit: Entry): void {
    this.matDialog.open(EditEntryComponent, {
      data: { entry: entryToEdit },
    });
  }

  public About(): void {
    this.matDialog.open(AboutDialogComponent);
  }
}
