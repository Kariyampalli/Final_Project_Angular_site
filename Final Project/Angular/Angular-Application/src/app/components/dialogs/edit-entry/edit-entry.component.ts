import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Entry } from '../../models/entry.model';
import { Dialog } from '../../models/dialog.model';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { FetchSendDataService } from 'src/app/services/fetch-send-data.service';


@Component({
  selector: 'app-edit-entry',
  templateUrl: './edit-entry.component.html',
  styleUrls: ['./edit-entry.component.scss'],
})
export class EditEntryComponent implements OnInit {
  public firstFormGroup: FormGroup = {} as FormGroup;

  public newEntry: Entry = {} as Entry;

  public ok = true;

  public updateDialog: Dialog = {} as Dialog;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { entry: Entry },
    private _formBuilder: FormBuilder,
    private dialog: DialogService,   
    private logger: LoggerService,
    private fetchSendDataService: FetchSendDataService) {
    this.newEntry.id = data.entry.id;
    this.newEntry.qrId = data.entry.qrId;
    this.newEntry.name = data.entry.name;
    this.newEntry.company = data.entry.company;
    this.newEntry.address = data.entry.address;
    this.newEntry.postalCode = data.entry.postalCode;
    this.newEntry.country = data.entry.country;
    this.newEntry.city = data.entry.city;
  }

  ngOnInit(): void {
    this.logger.log('Edit entry dialog called');
  }

  public async Update(): Promise<void> {
    //this.entriesHttpDataService.updateEntry("/entries/put/",this.newEntry);
    this.ok = await this.Check([
      this.newEntry.name,
      this.newEntry.company,
      this.newEntry.address,
      this.newEntry.postalCode,
      this.newEntry.country,
      this.newEntry.city,
    ]);
    if (this.ok) {
      this.newEntry.qrcode = document
        .getElementById('qrcode')
        ?.innerHTML.split('"')[1]
        .toString()!;

      console.log(this.newEntry.qrcode);

      const updateOk = await this.fetchSendDataService.updateEntry(
        '/entries/entry/',
        this.newEntry);
      if (updateOk) {
        this.fetchSendDataService.postInteraction('Entry (' + this.data.entry.id + ') has been edited');
        this.dialog.Success(
          'ENTRY WAS UPDATED!',
          '');
      } else {
        this.dialog.Error(
          'COULDNT UPDATE THE ENTRY',
          'Something went wrong, durig the process of updating the entry.');
      }
    } else {
      this.dialog.Error(
        'COULDNT UPDATE THE ENTRY',
        'A required field does not have an input.');
    }
  }

  private Check(strings: string[]): Promise<boolean> {
    let ok: boolean = true;
    strings.forEach((s) => {
      if (s.trim() === '' || s == undefined) {
        ok = false;
      }
    });
    return Promise.resolve(ok);
  }
}
