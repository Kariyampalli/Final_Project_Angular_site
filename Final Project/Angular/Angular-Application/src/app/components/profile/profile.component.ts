import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthentificationService } from 'src/app/services/authentification/authentification.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { FetchSendDataService } from 'src/app/services/fetch-send-data.service';
import { Admin } from '../models/admin.model';
import { MyResponse } from '../models/myResponse.model';
import { Portfolio } from '../models/portfolio.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public firstFormGroup: FormGroup = {} as FormGroup;

  public secondFormGroup: FormGroup = {} as FormGroup;

  admin: Admin = {} as Admin;

  myresponse: MyResponse = {} as MyResponse;

  constructor(
    private _formBuilder: FormBuilder,
    public authentificationService: AuthentificationService,
    private fetchSendDataService: FetchSendDataService,
    public dialog: DialogService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.admin.portfolio = {} as Portfolio;
    if (this.authentificationService.GetIsAutehnticated()) {
      this.admin = await Promise.resolve(this.authentificationService.getAdminInfo());
    } else {
      this.dialog.AccessDenied();
    }
  }

  public async Update(): Promise<void> { 
    this.fetchSendDataService.postInteraction('Someone might have updated his profile: ' + this.admin.name);
    if (await this.fetchSendDataService.updateAdmin('/admins/admin/' + this.admin.id, this.admin)) {
      this.dialog.Success('ADMIN PROFILE SUCCESSFULLY UPDATED!', '(Please note changes can only be done if the value of the field is not empty.)' );
    } else
      this.dialog.Error('ADMIN PROFILE COULD NOT BE UPDATED!', 'Error at using database or/and its value' );
  }
}
