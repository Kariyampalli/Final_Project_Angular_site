import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//import { AbstractLogger } from './services/abstract-logger';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsComponent } from './components/forms/forms.component';
import { EntriesComponent } from './components/entries/entries.component';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { EntrygeneratorComponent } from './components/entrygenerator/entrygenerator.component';
import { QRCodeModule } from 'angular2-qrcode';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { AccessdeniedComponent } from './components/dialogs/accessdenied/accessdenied.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { EditEntryComponent } from './components/dialogs/edit-entry/edit-entry.component';
import { ErrorDialogComponent } from './components/dialogs/error-dialog/error-dialog.component';
import { SuccessDialogComponent } from './components/dialogs/success-dialog/success-dialog.component';
import { CheckingComponent } from './components/checking/checking.component';
import { AboutDialogComponent } from './components/dialogs/about/about-dialog/about-dialog.component';
//import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
@NgModule({
  declarations: [
    AppComponent,
    EntrygeneratorComponent,
    NotFoundComponent,
    FormsComponent,
    EntriesComponent,
    EntrygeneratorComponent,
    AccessdeniedComponent,
    ProfileComponent,
    EditEntryComponent,
    ErrorDialogComponent,
    SuccessDialogComponent,
    CheckingComponent,
    AboutDialogComponent,
  ],
  imports: [
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatDialogModule,
    MatStepperModule,
    QRCodeModule,
    MatExpansionModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatTabsModule,
    /*TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader:{
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })*/
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

/*export function createTranslateLoader(http:HttpClient){
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}*/
