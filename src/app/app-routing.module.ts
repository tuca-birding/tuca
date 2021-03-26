import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxonComponent } from './taxon/taxon.component';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'upload',
    pathMatch: 'full'
  },
  {
    path: 'upload',
    component: UploadComponent
  },
  {
    path: 'taxon/:taxonUid',
    component: TaxonComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
