import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckingComponent } from './components/checking/checking.component';
import { EntriesComponent } from './components/entries/entries.component';
import { EntrygeneratorComponent } from './components/entrygenerator/entrygenerator.component';
import { FormsComponent } from './components/forms/forms.component';
import { ProfileComponent } from './components/profile/profile.component';
//import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  //{path: '**', component: NotFoundComponent},
  { path: 'forms', component: FormsComponent },
  { path: 'cts_entries', component: EntriesComponent },
  { path: 'createEntry', component: EntrygeneratorComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'checking/:id', component: CheckingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
