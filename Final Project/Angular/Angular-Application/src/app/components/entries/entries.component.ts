import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from 'src/app/services/authentification/authentification.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { FetchSendDataService } from 'src/app/services/fetch-send-data.service';
import { Dialog } from '../models/dialog.model';
import { Entry } from '../models/entry.model';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss'],
})
export class EntriesComponent implements OnInit {
  panelOpenState = false;

  entries!: Entry[];
  
  private entryDialog: Dialog = {} as Dialog;

  constructor(
    private authentificationService: AuthentificationService,
    private fetchSendDataService: FetchSendDataService,
    private dialog: DialogService) {}

  async ngOnInit(): Promise<void> {
    if (this.authentificationService.GetIsAutehnticated()) {
      this.ReceiveData();
    } else {
      this.dialog.AccessDenied();
    }
  }

  private async ReceiveData(): Promise<void> {
    this.entries = await Promise.resolve(this.fetchSendDataService.getEntries());
  }

  public async Delete(entry: Entry): Promise<void> {
    if (
      await Promise.resolve(
        this.fetchSendDataService.deleteEntry('entries/entry/', entry.id))
    ) {
      this.fetchSendDataService.postInteraction('Entry' + entry.id + 'has been deleted');
      this.dialog.Success('ENTRY SUCCESFULLY DELETED!', '');
    } else {
      this.dialog.Error(
        'DELETION OF ENTRY FAILED!',
        'There might be a problem witin our application or the entry tried to be removed does not exist/ has already been removed');
    }
    this.ReceiveData();
  }

  public Edit(entryToEdit: Entry): void {
    this.dialog.EditEntryDialog(entryToEdit);
  }
}
