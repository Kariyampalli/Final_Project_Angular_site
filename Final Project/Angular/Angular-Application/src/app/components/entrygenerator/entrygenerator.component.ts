import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthentificationService } from 'src/app/services/authentification/authentification.service';
import { Entry } from '../models/entry.model';
import * as uuid from 'uuid';
import { FetchSendDataService } from 'src/app/services/fetch-send-data.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';

@Component({
  selector: 'app-entrygenerator',
  templateUrl: './entrygenerator.component.html',
  styleUrls: ['./entrygenerator.component.scss'],
})
export class EntrygeneratorComponent implements OnInit {
  public firstFormGroup: FormGroup = {} as FormGroup;

  public entry: Entry = {} as Entry;

  public authentificationService: AuthentificationService = {} as AuthentificationService;

  constructor(
    private _formBuilder: FormBuilder,
    private atuhService: AuthentificationService,
    private dialog: DialogService,
    private fetchSendDataService: FetchSendDataService) {
    this.authentificationService = atuhService;
  }

  async ngOnInit(): Promise<void> {
    if (this.authentificationService.GetIsAutehnticated()) {
      this.createSide();
    } else {
      this.dialog.AccessDenied();
    }
  }

  private createSide(): void {
    this.entry.id = uuid.v4();
    this.firstFormGroup = this._formBuilder.group({
      nameField: ['', Validators.required],
      companyFiled: ['', Validators.required],
      countryField: ['', Validators.required],
      addressField: ['', Validators.required],
      postalCodeField: ['', Validators.required],
      cityField: ['', Validators.required],
    });
  }

  
  public async Create(): Promise<void> {
    this.fetchSendDataService.postInteraction('Entry' + this.entry.id + 'has been created');
    console.log('CREATING');
    this.entry.qrId = uuid.v4();
    this.entry.qrcode = document
      .getElementById('qrcode')
      ?.innerHTML.split('"')[1]
      .toString()!;
    const ok = await Promise.resolve(
      this.fetchSendDataService.InsertEntry('entries', this.entry));
    if (ok) {
      this.entry.id = uuid.v4();
      this.dialog.Success(
        'ENTRY SUCCESSFULLY CREATED!',
        'You can now see your newly created entry in the entries-section.');
    } else {
      this.dialog.Success(
        'FAILED TO CREATE NEW ENTRY!',
        "Be sure the api connection is working and the id isn't simalar to any other entry in the database.");
    }
  }
}
